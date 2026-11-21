# Changelog

## [Unreleased]

### Added

- Add a Go (Fiber) content API in `backend/` for Railway: Postgres storage with revision history, validation against JSON Schemas generated from the site's zod schemas, single-admin login with a per-client lockout (the admin API only answers requests carrying the Next server's `ADMIN_PROXY_SECRET`), and a batched, retried Vercel deploy hook that also fires on shutdown.
- Pull content from the API before `next build` when `CONTENT_API_URL` is set, validating it with zod and checking that project screenshots exist; without it the committed `content/` files are used (`pnpm content:pull` snapshots the database locally).
- Add a content admin at `/admin` (password login, JSON editors checked with the site's zod schemas) backed by the Go content API; it returns 404 in production until `CONTENT_API_URL` is set and is hidden from crawlers and the site navigation.
- Make site identity, contact links, SEO titles and descriptions, keywords, skills, manifest text and the FAQ editable content, stored as validated JSON in `content/`.
- Make curated projects (case studies, screenshots, order) and GitHub corrections editable content; tests check screenshot dimensions and a 600 KB size budget.
- Make the hero, capabilities, about prose, career timeline, services and booking options editable content; tests check that case-study and timeline links resolve.
- Let home, about and FAQ text use `{name}`, `{jobTitle}`, `{company}`, `{location}` and `{email}`, filled in from the site document so the hero and FAQ follow Site & contact.
- Add GitHub Actions checks for linting, type checking, tests, and production builds on pushes and pull requests.
- Add three selected project case studies with local screenshots, contributions, design decisions, and qualitative outcomes.
- Add a résumé download and regression tests for mobile navigation and homepage rendering without GitHub.

### Changed

- Move project screenshots to `/assets/projects/<slug>/image.*`; the old URLs redirect permanently.
- Render homepage projects from a curated selection independently of GitHub availability and repository activity.
- Replace numeric skill ratings with project and career evidence, and focus services on three deliverable-based offers with relevant examples.
- Clarify the homepage introduction and align the project archive, FAQ, and machine-readable site description with the selected work.

### Fixed

- Correct the Turfmapp job title in llms.txt to "Full Stack Software Developer", matching the résumé and career timeline, and test that the two stay in sync.
- Keep mobile navigation controls inside the focus trap and release scroll locks and inert page state when resizing to desktop.
- Run ambient cell animations only at desktop widths where the decoration is visible.
- Correct ByteTrack's frontend-demo description and URL, and prevent unverified repository homepages from overriding curated project links.
