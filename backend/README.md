# Portfolio content API

Go ([Fiber](https://gofiber.io)) service that stores the portfolio's editable content in Postgres. The Next.js site pulls it at build time (`scripts/pull-content.ts`), and the admin at `/admin` writes to it. Deployed on [Railway](https://railway.com).

## How it fits together

```
/admin (Next, Vercel) ──login/save──▶ content API (Go, Railway) ──▶ Postgres (Railway)
                                            │ debounced deploy hook
                                            ▼
                      Vercel build ── pnpm build pulls GET /api/content ──▶ static site
```

- **Storage.** `documents` (one row per `content/<name>.json`) and `projects` (one row per `content/projects/<slug>.json`) are stored as `json`, so the text round-trips exactly. Every write first copies the previous version into `revisions`. Migrations in `internal/store/migrations` run on boot.
- **Validation.** Writes are checked against `internal/content/schemas/*.json`, which are generated from the site's zod schemas. After changing `lib/content/schemas.ts`, run `pnpm content:schemas` in the repository root; a site test fails while they are stale.
- **Auth.** A single admin. `POST /api/admin/login` checks the password against a bcrypt hash and returns an HMAC-signed token (8 hours by default). After 5 failed attempts in 15 minutes, logins lock for 15 minutes.
- **Publishing.** After a save, the API calls the Vercel deploy hook once there have been no further saves for `PUBLISH_DELAY`. A run of edits therefore triggers a single rebuild.

## API

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/healthz` | – | Liveness and database check |
| GET | `/api/content` | – | Everything the site build needs: `{documents, projects}` |
| GET | `/api/content/:name` | – | One document |
| GET | `/api/projects`, `/api/projects/:slug` | – | Projects, sorted by `order` |
| POST | `/api/admin/login` | – | `{password}` → `{token, expiresAt}` |
| GET | `/api/admin/session` | Bearer | 204 if the token is valid |
| PUT | `/api/admin/content/:name` | Bearer | Replace a document (validated) |
| PUT / DELETE | `/api/admin/projects/:slug` | Bearer | Create/replace or delete a project |

## Configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string |
| `ADMIN_PASSWORD_HASH` | yes | bcrypt hash: `read -rs PW && printf '%s\n' "$PW" \| go run ./cmd/hash-password` |
| `SESSION_SECRET` | yes | 32+ random bytes, e.g. `openssl rand -hex 32` |
| `VERCEL_DEPLOY_HOOK_URL` | no | Vercel deploy hook; without it saves do not rebuild the site |
| `PUBLISH_DELAY` | no | Quiet period before the deploy hook fires (default `30s`) |
| `SESSION_TTL` | no | Admin session length (default `8h`) |
| `PORT` | no | Set by Railway (default `8080`) |

## Local development

```bash
docker run -d --name portfolio-pg -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=cms -p 5432:5432 postgres:17-alpine
export DATABASE_URL='postgres://postgres:dev@localhost:5432/cms?sslmode=disable'
go run ./cmd/seed                      # loads ../content (existing rows are kept; -force overwrites)
export ADMIN_PASSWORD_HASH="$(printf '%s\n' 'a-long-local-password' | go run ./cmd/hash-password)"
export SESSION_SECRET="$(openssl rand -hex 32)"
go run ./cmd/api                       # http://localhost:8080
```

Then run the site with `CONTENT_API_URL=http://localhost:8080 pnpm dev` and open http://localhost:3000/admin.

Tests: `go test -race ./...`. The store test needs Postgres: `TEST_DATABASE_URL=… go test ./internal/store`. CI provides both.

## Deploying on Railway

1. **New project → Deploy from GitHub repo** `naiplawan/portfolio`. In the service settings, set **Root Directory** to `/backend`. `railway.json` selects the Dockerfile and the `/healthz` health check.
2. **Add a PostgreSQL database** to the project, then set the service variable `DATABASE_URL` to `${{Postgres.DATABASE_URL}}`.
3. Set `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` and, from Vercel → Project → Settings → Git → **Deploy Hooks** (branch `main`), `VERCEL_DEPLOY_HOOK_URL`.
4. **Settings → Networking → Generate Domain** for the service.
5. Seed the database once from your machine, using the Postgres service's public connection URL: `DATABASE_URL='postgres://…' go run ./cmd/seed`.
6. In Vercel, set `CONTENT_API_URL=https://<your-railway-domain>` for Production (and Preview if you want previews to use live content), then redeploy.

Recover an overwritten document with SQL, e.g. `SELECT data FROM revisions WHERE kind = 'document' AND key = 'faq' ORDER BY created_at DESC LIMIT 5;`.
