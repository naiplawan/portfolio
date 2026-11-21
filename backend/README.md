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
- **Validation.** Writes are checked against `internal/content/schemas/*.json`, which are generated from the site's zod schemas. After changing `lib/content/schemas.ts`, run `pnpm content:schemas` in the repository root; a site test fails while they are stale. A few cross-field rules can't be expressed in JSON Schema: exactly one SEO entry per page, unique timeline ids, an answer unless the FAQ item uses the person summary, and whitespace-only text. The admin and the site build enforce those with zod.
- **Auth.** A single admin. Every `/api/admin/*` request must carry `X-Admin-Proxy-Secret`, which only the Next.js server knows; without it the API answers 404, so the admin API can't be reached directly. `POST /api/admin/login` checks the password against a bcrypt hash and returns an HMAC-signed token (8 hours by default). Each client IP, forwarded by Next as `X-Client-IP`, gets 5 attempts per 15 minutes and is then locked for 15 minutes. Attempts still in progress count toward the limit, so parallel guesses can't exceed it, and one attacker can't lock the owner out. Signing out deletes the cookie, but a token stays valid until it expires; rotate `SESSION_SECRET` to revoke every session.
- **Publishing.** After a save, the API calls the Vercel deploy hook once there have been no further saves for `PUBLISH_DELAY`, so a run of edits triggers a single rebuild. A failed call is retried three times (after 2 s, 10 s and 30 s). On shutdown, a pending rebuild fires immediately, so a redeploy right after a save doesn't drop it.

## API

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/healthz` | – | Liveness and database check |
| GET | `/api/content` | – | Everything the site build needs: `{documents, projects}` |
| GET | `/api/content/:name` | – | One document |
| GET | `/api/projects`, `/api/projects/:slug` | – | Projects, sorted by `order` |
| POST | `/api/admin/login` | – | `{password}` → `{token, expiresAt}` |
| GET | `/api/admin/session` | Bearer | 204 if the token is valid |

All `/api/admin/*` routes also require the `X-Admin-Proxy-Secret` header.
| PUT | `/api/admin/content/:name` | Bearer | Replace a document (validated) |
| PUT / DELETE | `/api/admin/projects/:slug` | Bearer | Create/replace or delete a project |

## Configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string |
| `ADMIN_PASSWORD_HASH` | yes | bcrypt hash: `read -rs PW && printf '%s\n' "$PW" \| go run ./cmd/hash-password` |
| `SESSION_SECRET` | yes | 32+ random bytes, e.g. `openssl rand -hex 32` |
| `ADMIN_PROXY_SECRET` | yes | 32+ characters shared with the Next.js app (set the same value on Vercel), e.g. `openssl rand -hex 32` |
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
export ADMIN_PROXY_SECRET="$(openssl rand -hex 32)"
go run ./cmd/api                       # http://localhost:8080
```

Then run the site with `CONTENT_API_URL=http://localhost:8080 ADMIN_PROXY_SECRET=<same value> pnpm dev` and open http://localhost:3000/admin.

Tests: `go test -race ./...`. The store test needs Postgres: `TEST_DATABASE_URL=… go test ./internal/store`. CI provides both.

## Deploying on Railway

1. **New project → Deploy from GitHub repo** `naiplawan/portfolio`. In the service settings, set **Root Directory** to `/backend`. `railway.json` selects the Dockerfile and the `/healthz` health check.
2. **Add a PostgreSQL database** to the project, then set the service variable `DATABASE_URL` to `${{Postgres.DATABASE_URL}}`.
3. Set `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `ADMIN_PROXY_SECRET` and, from Vercel → Project → Settings → Git → **Deploy Hooks** (branch `main`), `VERCEL_DEPLOY_HOOK_URL`.
4. **Settings → Networking → Generate Domain** for the service.
5. Seed the database once from your machine, using the Postgres service's public connection URL: `DATABASE_URL='postgres://…' go run ./cmd/seed`.
6. In Vercel, set `CONTENT_API_URL=https://<your-railway-domain>` and `ADMIN_PROXY_SECRET` (the same value as on Railway) for Production, and for Preview if you want previews to use live content. Then redeploy.

## Changing a content schema

Content in Postgres must satisfy the schema of the code being deployed. When a change makes existing content invalid (for example, a new required field):

1. Change `lib/content/schemas.ts`, run `pnpm content:schemas`, and update the committed `content/` files so CI passes.
2. Before or right after merging, update the live data. Either edit it in `/admin`, or reseed from the updated files with `go run ./cmd/seed -force`, which overwrites, so snapshot first with `pnpm content:pull`.

Until then, Vercel builds fail and the previous deployment stays live.

Recover an overwritten document with SQL, e.g. `SELECT data FROM revisions WHERE kind = 'document' AND key = 'faq' ORDER BY created_at DESC LIMIT 5;`.
