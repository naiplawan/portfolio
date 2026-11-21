// Package store persists content documents and projects in Postgres.
package store

import (
	"context"
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"sort"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

//go:embed migrations/*.sql
var migrations embed.FS

// ErrNotFound is returned when a document or project does not exist.
var ErrNotFound = errors.New("not found")

// Project is one entry of the curated projects collection.
type Project struct {
	Slug string          `json:"slug"`
	Data json.RawMessage `json:"data"`
}

// Store is the persistence API used by the HTTP handlers.
type Store interface {
	Documents(ctx context.Context) (map[string]json.RawMessage, error)
	Document(ctx context.Context, name string) (json.RawMessage, error)
	PutDocument(ctx context.Context, name string, data json.RawMessage) error
	Projects(ctx context.Context) ([]Project, error)
	Project(ctx context.Context, slug string) (json.RawMessage, error)
	PutProject(ctx context.Context, slug string, data json.RawMessage) error
	DeleteProject(ctx context.Context, slug string) error
}

// Postgres implements Store.
type Postgres struct {
	pool *pgxpool.Pool
}

// Open connects to Postgres and applies pending migrations.
func Open(ctx context.Context, databaseURL string) (*Postgres, error) {
	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return nil, err
	}
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, err
	}
	if err := migrate(ctx, pool); err != nil {
		pool.Close()
		return nil, fmt.Errorf("migrate: %w", err)
	}
	return &Postgres{pool: pool}, nil
}

// Close releases the connection pool.
func (p *Postgres) Close() { p.pool.Close() }

// Ping checks the database connection.
func (p *Postgres) Ping(ctx context.Context) error { return p.pool.Ping(ctx) }

func migrate(ctx context.Context, pool *pgxpool.Pool) error {
	entries, err := migrations.ReadDir("migrations")
	if err != nil {
		return err
	}
	names := make([]string, 0, len(entries))
	for _, entry := range entries {
		names = append(names, entry.Name())
	}
	sort.Strings(names)

	return pgx.BeginFunc(ctx, pool, func(tx pgx.Tx) error {
		// One migrator at a time, even if two instances boot together
		if _, err := tx.Exec(ctx, `SELECT pg_advisory_xact_lock(724190311)`); err != nil {
			return err
		}
		if _, err := tx.Exec(ctx, `CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`); err != nil {
			return err
		}
		for _, name := range names {
			version := strings.TrimSuffix(name, ".sql")
			var applied bool
			if err := tx.QueryRow(ctx, `SELECT EXISTS (SELECT 1 FROM schema_migrations WHERE version = $1)`, version).Scan(&applied); err != nil {
				return err
			}
			if applied {
				continue
			}
			sql, err := migrations.ReadFile("migrations/" + name)
			if err != nil {
				return err
			}
			if _, err := tx.Exec(ctx, string(sql)); err != nil {
				return fmt.Errorf("%s: %w", name, err)
			}
			if _, err := tx.Exec(ctx, `INSERT INTO schema_migrations (version) VALUES ($1)`, version); err != nil {
				return err
			}
		}
		return nil
	})
}

func (p *Postgres) Documents(ctx context.Context) (map[string]json.RawMessage, error) {
	rows, err := p.pool.Query(ctx, `SELECT name, data::text FROM documents`)
	if err != nil {
		return nil, err
	}
	documents := map[string]json.RawMessage{}
	for rows.Next() {
		var name, data string
		if err := rows.Scan(&name, &data); err != nil {
			return nil, err
		}
		documents[name] = json.RawMessage(data)
	}
	return documents, rows.Err()
}

func (p *Postgres) Document(ctx context.Context, name string) (json.RawMessage, error) {
	var data string
	err := p.pool.QueryRow(ctx, `SELECT data::text FROM documents WHERE name = $1`, name).Scan(&data)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrNotFound
	}
	return json.RawMessage(data), err
}

func (p *Postgres) PutDocument(ctx context.Context, name string, data json.RawMessage) error {
	return pgx.BeginFunc(ctx, p.pool, func(tx pgx.Tx) error {
		if _, err := tx.Exec(ctx, `INSERT INTO revisions (kind, key, data) SELECT 'document', name, data FROM documents WHERE name = $1`, name); err != nil {
			return err
		}
		_, err := tx.Exec(ctx, `
			INSERT INTO documents (name, data) VALUES ($1, $2::json)
			ON CONFLICT (name) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`, name, string(data))
		return err
	})
}

func (p *Postgres) Projects(ctx context.Context) ([]Project, error) {
	rows, err := p.pool.Query(ctx, `SELECT slug, data::text FROM projects ORDER BY (data->>'order')::int, slug`)
	if err != nil {
		return nil, err
	}
	projects := []Project{}
	for rows.Next() {
		var slug, data string
		if err := rows.Scan(&slug, &data); err != nil {
			return nil, err
		}
		projects = append(projects, Project{Slug: slug, Data: json.RawMessage(data)})
	}
	return projects, rows.Err()
}

func (p *Postgres) Project(ctx context.Context, slug string) (json.RawMessage, error) {
	var data string
	err := p.pool.QueryRow(ctx, `SELECT data::text FROM projects WHERE slug = $1`, slug).Scan(&data)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrNotFound
	}
	return json.RawMessage(data), err
}

func (p *Postgres) PutProject(ctx context.Context, slug string, data json.RawMessage) error {
	return pgx.BeginFunc(ctx, p.pool, func(tx pgx.Tx) error {
		if _, err := tx.Exec(ctx, `INSERT INTO revisions (kind, key, data) SELECT 'project', slug, data FROM projects WHERE slug = $1`, slug); err != nil {
			return err
		}
		_, err := tx.Exec(ctx, `
			INSERT INTO projects (slug, data) VALUES ($1, $2::json)
			ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`, slug, string(data))
		return err
	})
}

func (p *Postgres) DeleteProject(ctx context.Context, slug string) error {
	return pgx.BeginFunc(ctx, p.pool, func(tx pgx.Tx) error {
		if _, err := tx.Exec(ctx, `INSERT INTO revisions (kind, key, data) SELECT 'project', slug, data FROM projects WHERE slug = $1`, slug); err != nil {
			return err
		}
		tag, err := tx.Exec(ctx, `DELETE FROM projects WHERE slug = $1`, slug)
		if err == nil && tag.RowsAffected() == 0 {
			return ErrNotFound
		}
		return err
	})
}
