// Package api serves the content API: public reads for the site build and
// authenticated writes for the admin UI.
package api

import (
	"encoding/json"
	"errors"
	"log/slog"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/recover"

	"github.com/naiplawan/portfolio/backend/internal/auth"
	"github.com/naiplawan/portfolio/backend/internal/content"
	"github.com/naiplawan/portfolio/backend/internal/publish"
	"github.com/naiplawan/portfolio/backend/internal/store"
)

// Server wires the HTTP handlers to their dependencies.
type Server struct {
	Store     store.Store
	Validator *content.Validator
	Auth      *auth.Auth
	Publisher publish.Publisher
	Log       *slog.Logger
	// Health is optional; when set, /healthz checks it.
	Health func() error
}

// App builds the Fiber application.
func (s *Server) App() *fiber.App {
	app := fiber.New(fiber.Config{
		AppName:      "portfolio-content-api",
		BodyLimit:    1 << 20,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		ErrorHandler: s.errorHandler,
	})
	app.Use(recover.New())
	app.Use(func(c fiber.Ctx) error {
		c.Set("X-Content-Type-Options", "nosniff")
		c.Set("Cache-Control", "no-store")
		return c.Next()
	})

	app.Get("/healthz", s.health)

	public := app.Group("/api")
	public.Get("/content", s.bundle)
	public.Get("/content/:name", s.getDocument)
	public.Get("/projects", s.listProjects)
	public.Get("/projects/:slug", s.getProject)

	admin := app.Group("/api/admin")
	admin.Post("/login", s.login)
	admin.Use(s.requireSession)
	admin.Get("/session", func(c fiber.Ctx) error { return c.SendStatus(fiber.StatusNoContent) })
	admin.Put("/content/:name", s.putDocument)
	admin.Put("/projects/:slug", s.putProject)
	admin.Delete("/projects/:slug", s.deleteProject)
	return app
}

type errorBody struct {
	Error string `json:"error"`
}

func (s *Server) errorHandler(c fiber.Ctx, err error) error {
	var fe *fiber.Error
	if errors.As(err, &fe) {
		return c.Status(fe.Code).JSON(errorBody{fe.Message})
	}
	s.Log.Error("request failed", "method", c.Method(), "path", c.Path(), "error", err)
	return c.Status(fiber.StatusInternalServerError).JSON(errorBody{"internal error"})
}

func (s *Server) health(c fiber.Ctx) error {
	if s.Health != nil {
		if err := s.Health(); err != nil {
			return fiber.NewError(fiber.StatusServiceUnavailable, "database unavailable")
		}
	}
	return c.JSON(fiber.Map{"ok": true})
}

// bundle returns everything the site build needs in one request.
func (s *Server) bundle(c fiber.Ctx) error {
	documents, err := s.Store.Documents(c.Context())
	if err != nil {
		return err
	}
	projects, err := s.Store.Projects(c.Context())
	if err != nil {
		return err
	}
	return c.JSON(fiber.Map{"documents": documents, "projects": projects})
}

func (s *Server) getDocument(c fiber.Ctx) error {
	name := c.Params("name")
	if !s.Validator.IsDocument(name) {
		return fiber.NewError(fiber.StatusNotFound, "unknown document")
	}
	data, err := s.Store.Document(c.Context(), name)
	if errors.Is(err, store.ErrNotFound) {
		return fiber.NewError(fiber.StatusNotFound, "document not found")
	}
	if err != nil {
		return err
	}
	c.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)
	return c.Send(data)
}

func (s *Server) listProjects(c fiber.Ctx) error {
	projects, err := s.Store.Projects(c.Context())
	if err != nil {
		return err
	}
	return c.JSON(projects)
}

func (s *Server) getProject(c fiber.Ctx) error {
	slug := c.Params("slug")
	if !content.ValidSlug(slug) {
		return fiber.NewError(fiber.StatusNotFound, "project not found")
	}
	data, err := s.Store.Project(c.Context(), slug)
	if errors.Is(err, store.ErrNotFound) {
		return fiber.NewError(fiber.StatusNotFound, "project not found")
	}
	if err != nil {
		return err
	}
	c.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)
	return c.Send(data)
}

func (s *Server) login(c fiber.Ctx) error {
	var body struct {
		Password string `json:"password"`
	}
	if err := json.Unmarshal(c.Body(), &body); err != nil || body.Password == "" {
		return fiber.NewError(fiber.StatusBadRequest, "password is required")
	}
	token, expires, err := s.Auth.Login(body.Password)
	switch {
	case errors.Is(err, auth.ErrLocked):
		return fiber.NewError(fiber.StatusTooManyRequests, err.Error())
	case errors.Is(err, auth.ErrInvalidCredentials):
		s.Log.Warn("failed admin login")
		return fiber.NewError(fiber.StatusUnauthorized, "wrong password")
	case err != nil:
		return err
	}
	return c.JSON(fiber.Map{"token": token, "expiresAt": expires.UTC().Format(time.RFC3339)})
}

func (s *Server) requireSession(c fiber.Ctx) error {
	token, ok := strings.CutPrefix(c.Get(fiber.HeaderAuthorization), "Bearer ")
	if !ok || s.Auth.Verify(token) != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "sign in again")
	}
	return c.Next()
}

func (s *Server) validate(name string, body []byte) error {
	if err := s.Validator.Validate(name, body); err != nil {
		return fiber.NewError(fiber.StatusUnprocessableEntity, err.Error())
	}
	return nil
}

func (s *Server) putDocument(c fiber.Ctx) error {
	name := c.Params("name")
	if !s.Validator.IsDocument(name) {
		return fiber.NewError(fiber.StatusNotFound, "unknown document")
	}
	body := append([]byte(nil), c.Body()...)
	if err := s.validate(name, body); err != nil {
		return err
	}
	if err := s.Store.PutDocument(c.Context(), name, body); err != nil {
		return err
	}
	s.Log.Info("document saved", "name", name)
	s.Publisher.Schedule()
	return c.SendStatus(fiber.StatusNoContent)
}

func (s *Server) putProject(c fiber.Ctx) error {
	slug := c.Params("slug")
	if !content.ValidSlug(slug) {
		return fiber.NewError(fiber.StatusBadRequest, "slug must use lowercase letters, numbers and single hyphens")
	}
	body := append([]byte(nil), c.Body()...)
	if err := s.validate(content.ProjectSchema, body); err != nil {
		return err
	}
	if err := s.Store.PutProject(c.Context(), slug, body); err != nil {
		return err
	}
	s.Log.Info("project saved", "slug", slug)
	s.Publisher.Schedule()
	return c.SendStatus(fiber.StatusNoContent)
}

func (s *Server) deleteProject(c fiber.Ctx) error {
	slug := c.Params("slug")
	if !content.ValidSlug(slug) {
		return fiber.NewError(fiber.StatusNotFound, "project not found")
	}
	err := s.Store.DeleteProject(c.Context(), slug)
	if errors.Is(err, store.ErrNotFound) {
		return fiber.NewError(fiber.StatusNotFound, "project not found")
	}
	if err != nil {
		return err
	}
	s.Log.Info("project deleted", "slug", slug)
	s.Publisher.Schedule()
	return c.SendStatus(fiber.StatusNoContent)
}
