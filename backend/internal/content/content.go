// Package content validates portfolio content documents against the JSON
// Schemas generated from the site's zod schemas (pnpm content:schemas).
package content

import (
	"bytes"
	"embed"
	"errors"
	"fmt"
	"regexp"
	"sort"
	"strings"

	"github.com/santhosh-tekuri/jsonschema/v6"
)

//go:embed schemas/*.json
var schemaFiles embed.FS

// ProjectSchema is the schema name used for entries in the projects collection.
const ProjectSchema = "project"

// ErrUnknownDocument is returned for a document name with no schema.
var ErrUnknownDocument = errors.New("unknown content document")

var slugPattern = regexp.MustCompile(`^[a-z0-9]+(-[a-z0-9]+)*$`)

// ValidSlug reports whether s can name a project (file name and URL anchor).
func ValidSlug(s string) bool { return len(s) <= 80 && slugPattern.MatchString(s) }

// Validator holds the compiled schemas.
type Validator struct {
	schemas map[string]*jsonschema.Schema
}

// NewValidator compiles every embedded schema.
func NewValidator() (*Validator, error) {
	entries, err := schemaFiles.ReadDir("schemas")
	if err != nil {
		return nil, err
	}
	compiler := jsonschema.NewCompiler()
	compiler.AssertFormat()
	names := make([]string, 0, len(entries))
	for _, entry := range entries {
		raw, err := schemaFiles.ReadFile("schemas/" + entry.Name())
		if err != nil {
			return nil, err
		}
		doc, err := jsonschema.UnmarshalJSON(bytes.NewReader(raw))
		if err != nil {
			return nil, fmt.Errorf("%s: %w", entry.Name(), err)
		}
		if err := compiler.AddResource(entry.Name(), doc); err != nil {
			return nil, err
		}
		names = append(names, strings.TrimSuffix(entry.Name(), ".json"))
	}
	v := &Validator{schemas: make(map[string]*jsonschema.Schema, len(names))}
	for _, name := range names {
		schema, err := compiler.Compile(name + ".json")
		if err != nil {
			return nil, fmt.Errorf("%s: %w", name, err)
		}
		v.schemas[name] = schema
	}
	return v, nil
}

// Documents lists the single-file document names, sorted.
func (v *Validator) Documents() []string {
	names := make([]string, 0, len(v.schemas))
	for name := range v.schemas {
		if name != ProjectSchema {
			names = append(names, name)
		}
	}
	sort.Strings(names)
	return names
}

// IsDocument reports whether name is a known single-file document.
func (v *Validator) IsDocument(name string) bool {
	_, ok := v.schemas[name]
	return ok && name != ProjectSchema
}

// Validate checks raw JSON against the named schema ("project" for projects).
func (v *Validator) Validate(name string, raw []byte) error {
	schema, ok := v.schemas[name]
	if !ok {
		return ErrUnknownDocument
	}
	instance, err := jsonschema.UnmarshalJSON(bytes.NewReader(raw))
	if err != nil {
		return fmt.Errorf("invalid JSON: %w", err)
	}
	return schema.Validate(instance)
}
