// Command api serves the portfolio content API.
package main

import (
	"context"
	"errors"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/naiplawan/portfolio/backend/internal/api"
	"github.com/naiplawan/portfolio/backend/internal/auth"
	"github.com/naiplawan/portfolio/backend/internal/content"
	"github.com/naiplawan/portfolio/backend/internal/publish"
	"github.com/naiplawan/portfolio/backend/internal/store"
)

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	if err := run(log); err != nil {
		log.Error("fatal", "error", err)
		os.Exit(1)
	}
}

func run(log *slog.Logger) error {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return errors.New("DATABASE_URL is required")
	}
	sessionTTL, err := durationEnv("SESSION_TTL", 8*time.Hour)
	if err != nil {
		return err
	}
	publishDelay, err := durationEnv("PUBLISH_DELAY", 30*time.Second)
	if err != nil {
		return err
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	validator, err := content.NewValidator()
	if err != nil {
		return err
	}
	admin, err := auth.New(os.Getenv("ADMIN_PASSWORD_HASH"), []byte(os.Getenv("SESSION_SECRET")), sessionTTL)
	if err != nil {
		return err
	}
	db, err := store.Open(ctx, databaseURL)
	if err != nil {
		return err
	}
	defer db.Close()

	server := &api.Server{
		Store:     db,
		Validator: validator,
		Auth:      admin,
		Publisher: publish.NewDeployHook(os.Getenv("VERCEL_DEPLOY_HOOK_URL"), publishDelay, log),
		Log:       log,
		Health: func() error {
			ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
			defer cancel()
			return db.Ping(ctx)
		},
	}
	app := server.App()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	errs := make(chan error, 1)
	go func() { errs <- app.Listen(":" + port) }()
	log.Info("content API listening", "port", port)

	select {
	case err := <-errs:
		return err
	case <-ctx.Done():
		shutdown, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return app.ShutdownWithContext(shutdown)
	}
}

func durationEnv(name string, fallback time.Duration) (time.Duration, error) {
	value := os.Getenv(name)
	if value == "" {
		return fallback, nil
	}
	return time.ParseDuration(value)
}
