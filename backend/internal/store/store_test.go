package store

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"testing"
)

// Runs against a real Postgres when TEST_DATABASE_URL is set (CI provides one).
func TestPostgres(t *testing.T) {
	url := os.Getenv("TEST_DATABASE_URL")
	if url == "" {
		t.Skip("TEST_DATABASE_URL not set")
	}
	ctx := context.Background()
	db, err := Open(ctx, url)
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	for _, table := range []string{"documents", "projects", "revisions"} {
		if _, err := db.pool.Exec(ctx, "TRUNCATE "+table); err != nil {
			t.Fatal(err)
		}
	}
	// Migrations are idempotent
	if err := migrate(ctx, db.pool); err != nil {
		t.Fatal(err)
	}

	doc := json.RawMessage(`{"z": 1, "a": "keeps key order"}`)
	if err := db.PutDocument(ctx, "site", doc); err != nil {
		t.Fatal(err)
	}
	if err := db.PutDocument(ctx, "site", json.RawMessage(`{"z": 2}`)); err != nil {
		t.Fatal(err)
	}
	got, err := db.Document(ctx, "site")
	if err != nil || string(got) != `{"z": 2}` {
		t.Fatalf("document = %s, %v", got, err)
	}
	var revisions int
	_ = db.pool.QueryRow(ctx, `SELECT count(*) FROM revisions WHERE key = 'site'`).Scan(&revisions)
	if revisions != 1 {
		t.Fatalf("revisions = %d, want 1", revisions)
	}
	if _, err := db.Document(ctx, "missing"); !errors.Is(err, ErrNotFound) {
		t.Fatalf("missing document: %v", err)
	}

	_ = db.PutProject(ctx, "b", json.RawMessage(`{"order": 2}`))
	_ = db.PutProject(ctx, "a", json.RawMessage(`{"order": 10}`))
	_ = db.PutProject(ctx, "c", json.RawMessage(`{"order": 1}`))
	_ = db.PutProject(ctx, "d", json.RawMessage(`{"order": 3000000000}`))
	projects, err := db.Projects(ctx)
	if err != nil {
		t.Fatal(err)
	}
	order := ""
	for _, p := range projects {
		order += p.Slug
	}
	if order != "cbad" {
		t.Fatalf("project order = %s, want cbad (numeric order, no int overflow)", order)
	}
	if err := db.DeleteProject(ctx, "b"); err != nil {
		t.Fatal(err)
	}
	if err := db.DeleteProject(ctx, "b"); !errors.Is(err, ErrNotFound) {
		t.Fatalf("second delete: %v", err)
	}
}
