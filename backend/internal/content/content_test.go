package content

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// The repository's content/ directory is the seed data; it must pass the API's validation.
func TestRepositoryContentIsValid(t *testing.T) {
	v, err := NewValidator()
	if err != nil {
		t.Fatal(err)
	}
	root := filepath.Join("..", "..", "..", "content")
	for _, name := range v.Documents() {
		raw, err := os.ReadFile(filepath.Join(root, name+".json"))
		if err != nil {
			t.Fatalf("%s: %v", name, err)
		}
		if err := v.Validate(name, raw); err != nil {
			t.Errorf("%s: %v", name, err)
		}
	}
	files, _ := filepath.Glob(filepath.Join(root, "projects", "*.json"))
	if len(files) == 0 {
		t.Fatal("no project files found")
	}
	for _, file := range files {
		raw, _ := os.ReadFile(file)
		if err := v.Validate(ProjectSchema, raw); err != nil {
			t.Errorf("%s: %v", filepath.Base(file), err)
		}
		if slug := strings.TrimSuffix(filepath.Base(file), ".json"); !ValidSlug(slug) {
			t.Errorf("%s: invalid slug", slug)
		}
	}
}

func TestValidateRejectsBadContent(t *testing.T) {
	v, err := NewValidator()
	if err != nil {
		t.Fatal(err)
	}
	cases := map[string]string{
		"missing field": `{"items":[{"question":"Q","usePersonSummary":false}]}`,
		"unknown field": `{"items":[{"question":"Q","usePersonSummary":false,"answer":"A","extra":1}]}`,
		"empty list":    `{"items":[]}`,
		"not json":      `{"items":`,
	}
	for label, body := range cases {
		if err := v.Validate("faq", []byte(body)); err == nil {
			t.Errorf("%s: expected an error", label)
		}
	}
	if err := v.Validate("site", []byte(`{"name":"A","jobTitle":"B","company":"C","location":"D","email":"not-an-email","github":"https://github.com/x","linkedin":"https://linkedin.com/x","facebook":"https://facebook.com/x"}`)); err == nil {
		t.Error("invalid email: expected an error")
	}
	if err := v.Validate("nope", []byte(`{}`)); err != ErrUnknownDocument {
		t.Errorf("unknown document: got %v", err)
	}
}

func TestValidSlug(t *testing.T) {
	for _, slug := range []string{"perd-wai", "bytetrack", "a1"} {
		if !ValidSlug(slug) {
			t.Errorf("%q should be valid", slug)
		}
	}
	for _, slug := range []string{"", "Perd", "a--b", "-a", "a/b", "../x"} {
		if ValidSlug(slug) {
			t.Errorf("%q should be invalid", slug)
		}
	}
}
