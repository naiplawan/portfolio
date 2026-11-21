-- Content documents and projects are stored as `json` (not `jsonb`) so the
-- text, including key order, round-trips exactly into content/*.json.
CREATE TABLE documents (
    name       text PRIMARY KEY,
    data       json NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE projects (
    slug       text PRIMARY KEY,
    data       json NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Every write keeps the previous version, so an overwrite can be recovered with SQL.
CREATE TABLE revisions (
    id         bigserial PRIMARY KEY,
    kind       text NOT NULL CHECK (kind IN ('document', 'project')),
    key        text NOT NULL,
    data       json,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX revisions_kind_key_idx ON revisions (kind, key, created_at DESC);
