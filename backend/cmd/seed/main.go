// Command seed loads the repository's content/ JSON into Postgres. Existing
// rows are kept unless -force is given, so it is safe to run on every deploy.
package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/naiplawan/portfolio/backend/internal/content"
	"github.com/naiplawan/portfolio/backend/internal/store"
)

func main() {
	dir := flag.String("dir", "../content", "directory with the content JSON files")
	force := flag.Bool("force", false, "overwrite rows that already exist")
	flag.Parse()
	if err := run(*dir, *force); err != nil {
		fmt.Fprintln(os.Stderr, "seed:", err)
		os.Exit(1)
	}
}

func run(dir string, force bool) error {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return errors.New("DATABASE_URL is required")
	}
	validator, err := content.NewValidator()
	if err != nil {
		return err
	}
	ctx := context.Background()
	db, err := store.Open(ctx, databaseURL)
	if err != nil {
		return err
	}
	defer db.Close()

	for _, name := range validator.Documents() {
		raw, err := os.ReadFile(filepath.Join(dir, name+".json"))
		if err != nil {
			return err
		}
		if err := validator.Validate(name, raw); err != nil {
			return fmt.Errorf("%s: %w", name, err)
		}
		if _, err := db.Document(ctx, name); err == nil && !force {
			fmt.Println("kept     document", name)
			continue
		}
		if err := db.PutDocument(ctx, name, raw); err != nil {
			return err
		}
		fmt.Println("seeded   document", name)
	}

	files, err := filepath.Glob(filepath.Join(dir, "projects", "*.json"))
	if err != nil {
		return err
	}
	for _, file := range files {
		slug := strings.TrimSuffix(filepath.Base(file), ".json")
		if !content.ValidSlug(slug) {
			return fmt.Errorf("%s: invalid slug", file)
		}
		raw, err := os.ReadFile(file)
		if err != nil {
			return err
		}
		if err := validator.Validate(content.ProjectSchema, raw); err != nil {
			return fmt.Errorf("%s: %w", slug, err)
		}
		if _, err := db.Project(ctx, slug); err == nil && !force {
			fmt.Println("kept     project ", slug)
			continue
		}
		if err := db.PutProject(ctx, slug, raw); err != nil {
			return err
		}
		fmt.Println("seeded   project ", slug)
	}
	return nil
}
