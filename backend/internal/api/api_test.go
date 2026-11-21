package api

import (
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"testing"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/naiplawan/portfolio/backend/internal/auth"
	"github.com/naiplawan/portfolio/backend/internal/content"
	"github.com/naiplawan/portfolio/backend/internal/store"
)

type memoryStore struct {
	mu        sync.Mutex
	documents map[string]json.RawMessage
	projects  map[string]json.RawMessage
}

func (m *memoryStore) Documents(context.Context) (map[string]json.RawMessage, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	out := map[string]json.RawMessage{}
	for k, v := range m.documents {
		out[k] = v
	}
	return out, nil
}

func (m *memoryStore) Document(_ context.Context, name string) (json.RawMessage, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if d, ok := m.documents[name]; ok {
		return d, nil
	}
	return nil, store.ErrNotFound
}

func (m *memoryStore) PutDocument(_ context.Context, name string, data json.RawMessage) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.documents[name] = data
	return nil
}

func (m *memoryStore) Projects(context.Context) ([]store.Project, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	out := []store.Project{}
	for slug, data := range m.projects {
		out = append(out, store.Project{Slug: slug, Data: data})
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Slug < out[j].Slug })
	return out, nil
}

func (m *memoryStore) Project(_ context.Context, slug string) (json.RawMessage, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if d, ok := m.projects[slug]; ok {
		return d, nil
	}
	return nil, store.ErrNotFound
}

func (m *memoryStore) PutProject(_ context.Context, slug string, data json.RawMessage) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.projects[slug] = data
	return nil
}

func (m *memoryStore) DeleteProject(_ context.Context, slug string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if _, ok := m.projects[slug]; !ok {
		return store.ErrNotFound
	}
	delete(m.projects, slug)
	return nil
}

type countingPublisher struct{ calls int }

func (p *countingPublisher) Schedule() { p.calls++ }

func repoContent(t *testing.T, path string) []byte {
	t.Helper()
	raw, err := os.ReadFile(filepath.Join("..", "..", "..", "content", path))
	if err != nil {
		t.Fatal(err)
	}
	return raw
}

func newServer(t *testing.T) (*Server, *memoryStore, *countingPublisher) {
	t.Helper()
	validator, err := content.NewValidator()
	if err != nil {
		t.Fatal(err)
	}
	hash, _ := bcrypt.GenerateFromPassword([]byte("letmein"), bcrypt.MinCost)
	a, err := auth.New(string(hash), []byte(strings.Repeat("k", 32)), time.Hour)
	if err != nil {
		t.Fatal(err)
	}
	mem := &memoryStore{
		documents: map[string]json.RawMessage{"faq": repoContent(t, "faq.json")},
		projects:  map[string]json.RawMessage{"perd-wai": repoContent(t, "projects/perd-wai.json")},
	}
	pub := &countingPublisher{}
	return &Server{Store: mem, Validator: validator, Auth: a, Publisher: pub, Log: slog.New(slog.NewTextHandler(io.Discard, nil)), ProxySecret: []byte(proxySecret)}, mem, pub
}

const proxySecret = "proxy-secret-proxy-secret-proxy-secret"

func do(t *testing.T, s *Server, method, path, token, body string, headers ...string) (*http.Response, string) {
	t.Helper()
	req := httptest.NewRequest(method, path, strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Admin-Proxy-Secret", proxySecret)
	for i := 0; i+1 < len(headers); i += 2 {
		req.Header.Set(headers[i], headers[i+1])
	}
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	res, err := s.App().Test(req)
	if err != nil {
		t.Fatal(err)
	}
	raw, _ := io.ReadAll(res.Body)
	return res, string(raw)
}

func login(t *testing.T, s *Server) string {
	t.Helper()
	res, body := do(t, s, http.MethodPost, "/api/admin/login", "", `{"password":"letmein"}`)
	if res.StatusCode != http.StatusOK {
		t.Fatalf("login: %d %s", res.StatusCode, body)
	}
	var out struct{ Token string }
	_ = json.Unmarshal([]byte(body), &out)
	return out.Token
}

func TestPublicReads(t *testing.T) {
	s, _, _ := newServer(t)
	res, body := do(t, s, http.MethodGet, "/api/content", "", "")
	if res.StatusCode != http.StatusOK || !strings.Contains(body, `"faq"`) || !strings.Contains(body, `"perd-wai"`) {
		t.Fatalf("bundle: %d %s", res.StatusCode, body)
	}
	res, body = do(t, s, http.MethodGet, "/api/content/faq", "", "")
	if res.StatusCode != http.StatusOK || body != string(repoContent(t, "faq.json")) {
		t.Fatalf("document should round-trip byte for byte: %d", res.StatusCode)
	}
	for path, want := range map[string]int{
		"/api/content/unknown":   http.StatusNotFound,
		"/api/content/site":      http.StatusNotFound,
		"/api/projects/perd-wai": http.StatusOK,
		"/api/projects/missing":  http.StatusNotFound,
		"/api/projects/..%2Fx":   http.StatusNotFound,
		"/healthz":               http.StatusOK,
	} {
		if res, _ := do(t, s, http.MethodGet, path, "", ""); res.StatusCode != want {
			t.Errorf("GET %s = %d, want %d", path, res.StatusCode, want)
		}
	}
}

func TestWritesRequireASession(t *testing.T) {
	s, _, pub := newServer(t)
	for _, token := range []string{"", "forged.token"} {
		res, _ := do(t, s, http.MethodPut, "/api/admin/content/faq", token, string(repoContent(t, "faq.json")))
		if res.StatusCode != http.StatusUnauthorized {
			t.Errorf("token %q: status %d", token, res.StatusCode)
		}
	}
	if res, _ := do(t, s, http.MethodPost, "/api/admin/login", "", `{"password":"nope"}`); res.StatusCode != http.StatusUnauthorized {
		t.Errorf("wrong password: %d", res.StatusCode)
	}
	if pub.calls != 0 {
		t.Errorf("publisher called %d times", pub.calls)
	}
}

func TestSaveDocumentValidatesAndPublishes(t *testing.T) {
	s, mem, pub := newServer(t)
	token := login(t, s)

	if res, _ := do(t, s, http.MethodGet, "/api/admin/session", token, ""); res.StatusCode != http.StatusNoContent {
		t.Fatalf("session: %d", res.StatusCode)
	}

	res, body := do(t, s, http.MethodPut, "/api/admin/content/faq", token, `{"items":[]}`)
	if res.StatusCode != http.StatusUnprocessableEntity || !strings.Contains(body, "error") {
		t.Fatalf("invalid document: %d %s", res.StatusCode, body)
	}
	if res, _ := do(t, s, http.MethodPut, "/api/admin/content/unknown", token, `{}`); res.StatusCode != http.StatusNotFound {
		t.Fatalf("unknown document: %d", res.StatusCode)
	}

	site := string(repoContent(t, "site.json"))
	if res, body := do(t, s, http.MethodPut, "/api/admin/content/site", token, site); res.StatusCode != http.StatusNoContent {
		t.Fatalf("valid document: %d %s", res.StatusCode, body)
	}
	if string(mem.documents["site"]) != site {
		t.Fatal("document not stored verbatim")
	}
	if pub.calls != 1 {
		t.Fatalf("publisher called %d times, want 1", pub.calls)
	}
}

func TestSaveAndDeleteProject(t *testing.T) {
	s, mem, pub := newServer(t)
	token := login(t, s)
	project := string(repoContent(t, "projects/layer-3d.json"))

	if res, _ := do(t, s, http.MethodPut, "/api/admin/projects/Bad_Slug", token, project); res.StatusCode != http.StatusBadRequest {
		t.Fatalf("bad slug: %d", res.StatusCode)
	}
	if res, body := do(t, s, http.MethodPut, "/api/admin/projects/layer-3d", token, project); res.StatusCode != http.StatusNoContent {
		t.Fatalf("save: %d %s", res.StatusCode, body)
	}
	if _, ok := mem.projects["layer-3d"]; !ok {
		t.Fatal("project not stored")
	}
	if res, _ := do(t, s, http.MethodDelete, "/api/admin/projects/layer-3d", token, ""); res.StatusCode != http.StatusNoContent {
		t.Fatalf("delete: %d", res.StatusCode)
	}
	if res, _ := do(t, s, http.MethodDelete, "/api/admin/projects/layer-3d", token, ""); res.StatusCode != http.StatusNotFound {
		t.Fatalf("second delete: %d", res.StatusCode)
	}
	if pub.calls != 2 {
		t.Fatalf("publisher called %d times, want 2", pub.calls)
	}
}

func TestAdminAPIRequiresTheProxySecret(t *testing.T) {
	s, _, _ := newServer(t)
	for _, secret := range []string{"", "wrong-secret"} {
		res, _ := do(t, s, http.MethodPost, "/api/admin/login", "", `{"password":"letmein"}`, "X-Admin-Proxy-Secret", secret)
		if res.StatusCode != http.StatusNotFound {
			t.Errorf("secret %q: status %d, want 404", secret, res.StatusCode)
		}
	}
	// Public reads do not need it
	if res, _ := do(t, s, http.MethodGet, "/api/content", "", "", "X-Admin-Proxy-Secret", ""); res.StatusCode != http.StatusOK {
		t.Errorf("public read: %d", res.StatusCode)
	}
}

func TestLoginLockoutUsesTheForwardedClient(t *testing.T) {
	s, _, _ := newServer(t)
	for i := 0; i < 5; i++ {
		do(t, s, http.MethodPost, "/api/admin/login", "", `{"password":"nope"}`, "X-Client-IP", "198.51.100.7")
	}
	if res, _ := do(t, s, http.MethodPost, "/api/admin/login", "", `{"password":"letmein"}`, "X-Client-IP", "198.51.100.7"); res.StatusCode != http.StatusTooManyRequests {
		t.Fatalf("locked client: %d", res.StatusCode)
	}
	if res, _ := do(t, s, http.MethodPost, "/api/admin/login", "", `{"password":"letmein"}`, "X-Client-IP", "203.0.113.1"); res.StatusCode != http.StatusOK {
		t.Fatalf("other client: %d", res.StatusCode)
	}
}
