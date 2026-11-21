# CMS plan — portfolio-react-page

Status: **proposal, nothing implemented**. Written 2026-11-21 against `dfedb5e` (branch `rachaphol/chore-planning-only`), plus a read-only look at uncommitted work in the main checkout (`app/resources/`, `public/downloads/`, `app/sitemap.xml/route.ts`, `CHANGELOG.md`).

**Recommendation in one line:** use **Keystatic in GitHub mode**. It keeps content as typed YAML/Markdoc files in this repo, so pages stay statically generated, every edit goes through the existing CI and a Vercel preview, and it costs nothing.

---

## 1. Inventory of hard-coded content

Today all editable content is TypeScript constants or JSX text. The table is grouped by how much an editor would need to change it.

### 1a. Structured data — high value for a CMS

| Content | File | Shape | Consumers |
| --- | --- | --- | --- |
| Featured case studies (3) | `lib/data/featured-projects.ts` | `FeaturedProject[]`: `id` (GitHub repo id), `slug`, `title`, `description`, `problemStatement`, `solution`, `contribution`, `designDecision`, `businessImpact.businessOutcome`, `image` (path in `public/assets/projects/`), `screenshot {alt,width,height,caption}`, `technologies[]`, `githubUrl`, `liveUrl?`, `category` enum, `status` enum, `featured`, `completedYear` | Home `ProjectsSection` (`#project-<slug>` anchors), `applyProjectOverrides`, llms.txt, ItemList JSON-LD, tests |
| Extra curated project (ByteTrack) | `lib/data/projects-data.ts` `FALLBACK_PROJECTS` | `Project` (same as above minus case-study fields, plus `highlights[]`) | `/projects` fallback when GitHub fails |
| GitHub overrides | `lib/data/projects-data.ts` `PROJECT_OVERRIDES` | `Record<repoName, {title?, description?, liveUrl?: string \| null}>`; `null` removes a dead GitHub homepage. Live URLs were checked by hand against `vercel project ls` (2026-10-11) | `/projects`, llms.txt |
| Project archive | GitHub API (`lib/utils/github-sync.ts`, `next: { revalidate: 3600 }`) | Not hard-coded — stays dynamic | `/projects`, `/api/github/projects`, llms.txt |
| Career timeline (4 entries) | `lib/data/timeline-data.ts` | `TimelineItem[]`: `id`, `type` enum, `title`, `organization`, `location?`, `date`/`endDate` (`YYYY-MM`), `description`, `highlights[]`, `technologies[]`, `commit {hash,message,world}` (the git-log / level-map flavour) | Home `AboutSection` + `LevelMap`, `/about` `Timeline` (anchors `#work-2` etc.) |
| FAQ (6) | `lib/data/faq-data.ts` | `{question, answer}[]`; answer 1 **is** `PERSON_SUMMARY`, answer 5 interpolates `SOCIAL_LINKS.email`. Rule: third person, self-contained, reused verbatim in the page, FAQPage JSON-LD and llms.txt | `FaqSection`, `FaqStructuredData`, llms.txt |
| Services (3) + process (4 steps) | `app/services/page.tsx` (inline arrays) | `{title, suitableFor, deliverable, features[], example {name, href}}`; `{step, title, description}` | `/services`; titles also become `?subject=` prefills |
| Booking options | `app/booking/page.tsx` (inline arrays) | `timeSlots {time,type,description}[]`, `topics {title,description}[]`, `preparation {title,description}[]` | `/booking` |
| Home capabilities (4) | `components/sections/SkillsSection.tsx` | `{name, tools, evidence, href, link}` — `href` points at `#project-<slug>` or `/about#work-2` | Home |
| About capabilities (3) | `components/portfolio/AboutMe.tsx` | `{title, description}` | `/about` |
| Hero config block | `components/sections/DeveloperHero.tsx` | `{key, value}[]` rendered as `rachaphol.config.ts`; `value` lengths drive CSS `steps(n)` typing animation | Home hero |

### 1b. Identity, SEO and site settings

| Content | File | Notes |
| --- | --- | --- |
| Person facts | `lib/constants.ts` `PROFESSIONAL_INFO`, `SOCIAL_LINKS`, `EMPLOYMENT`, `EDUCATION`, `RESUME_PATH` | Used by hero, footer, contact, JSON-LD, llms.txt, OG image. `EMPLOYMENT`/`EDUCATION` duplicate the timeline and have already drifted ("Junior Full Stack Software Developer" vs "Full Stack Software Developer") |
| Person summary + skills | `lib/seo.ts` `PERSON_SUMMARY`, `KNOWS_ABOUT`, `SAME_AS`, `siteGraph()` (Person/Org/WebSite, stable `@id`s) | Must stay a single Person node |
| Per-page title/description | `export const metadata = pageMetadata({...})` in `app/page.tsx` (custom), `app/about`, `app/projects`, `app/services`, `app/booking`, `app/contact/layout.tsx`, `app/resources/google-account-checklist` (uncommitted) | Root defaults + `keywords` in `app/layout.tsx` |
| OG image text | `app/opengraph-image.tsx` | Reads `PROFESSIONAL_INFO`; tagline inline |
| Web manifest | `app/manifest.json/route.ts` | Description is stale ("fullstack… AI integration") |
| llms.txt | `app/llms.txt/route.ts` | Generated from constants, projects and FAQ — **page list is hand-written** and misses new pages |
| Sitemap | `app/sitemap.xml/route.ts` | Hand-written route list; `lastModified: new Date()` on every request. Main checkout has an uncommitted entry for `/resources/google-account-checklist` |
| robots.txt | `app/robots.txt/route.ts` | Allows crawlers, blocks `/api/` |

### 1c. Long-form / standalone pages

| Content | File | Notes |
| --- | --- | --- |
| Vinly Fold privacy policy | `public/vinly-fold/privacy/index.html` | Standalone static HTML (own inline CSS, no site chrome), bilingual EN/TH. Its public URL is likely referenced from a Play Store listing, so the URL must not change |
| Google Account checklist (uncommitted, other team) | `main checkout: app/resources/google-account-checklist/page.tsx` + `public/downloads/google-account-checklist-v1.{pdf,png}` | Thai-language page: `items {title, detail, id}[]` (id = Google Help answer id), `sources {id,title}[]`, PDF/PNG download links, "read on" date, disclaimer. First of a likely "resources" series |
| Résumé | `public/Rachaphol_Resume.pdf` | Binary file linked from hero |

### 1d. Microcopy — recommend keeping in code

Hero headline + intro paragraphs (`DeveloperHero.tsx` — word-by-word animation timing), About section paragraphs (`AboutSection.tsx`), contact CTA headline and channel list (`ContactSection.tsx`, `app/contact/page.tsx` form labels/errors), nav and footer links, 404 copy, section headings/kickers passed to `SectionHeading`. These are tied to layout and motion; moving them buys little. Phase 3 lists the few paragraphs worth moving (hero/about prose) as optional.

### Drive-by observations (not part of this plan; not fixed)

- `TYPEWRITER_WORDS`, `SKILL_TAGS`, `ANIMATION_VARIANTS` in `lib/constants.ts` appear unused.
- README still describes "serif display type, one vermilion accent".
- HSTS is set in both `vercel.json` (2 years, preload) and `next.config.mjs` (1 year).

---

## 2. Options compared

Assumptions: one editor (the owner, a developer), content changes a few times a month, English site with some Thai pages, Vercel Hobby/Pro hosting, SEO-critical static output. Hosted-tier limits change often — verify current pricing at signup.

| | **Keystatic** (git-based) | **TinaCMS** (git-based + Tina Cloud) | **Sanity** (hosted headless) | **Payload 3** (in-app, Postgres) | **Self-built admin** (Supabase + `/admin`) |
| --- | --- | --- | --- | --- | --- |
| Cost | $0 (GitHub mode). Keystatic Cloud optional, free for small teams | $0 on Tina Cloud free tier (small user cap); paid above | $0 free tier is generous for one editor; paid per seat beyond | $0 software; needs Postgres (Neon/Supabase free tier) + Vercel Blob for media | Supabase free tier (pauses when idle) |
| Hosting | Admin UI at `/keystatic` inside this Next app; content in this repo | Admin at `/admin` (static build); Tina Cloud hosts GraphQL index + auth | Studio hosted by Sanity or embedded at `/studio`; content in Sanity's datastore | Admin + API inside this Next app as route group; DB external | Your code, your DB |
| Auth | GitHub OAuth app — anyone with push access to the repo; nobody else | Tina Cloud accounts | Sanity accounts (Google/GitHub/email) | Payload users collection (email/password), you own it | Supabase Auth + middleware you write and secure |
| Editing UX | Clean form UI generated from schema; Markdoc/MDX rich text; image/file upload commits to repo | Best-in-class visual (click-on-page) editing, needs components wired with `tinaField` | Very good, customisable Studio, real-time collab | Good admin, Lexical rich text | Whatever you build |
| Preview | Each edit can be saved to a branch → Vercel Preview URL; draft vs merge | Visual live preview in the admin; branches on paid tiers | Presentation tool + Next draft mode | Live preview + drafts | Build it |
| Static gen / SEO | Unchanged: files read at build with `createReader`; fully static HTML, no runtime dependency | Static at build via generated client, but build depends on Tina Cloud being reachable (or local mode) | Fetch at build/ISR; needs on-demand revalidation webhook; site output depends on Sanity API uptime at build | DB queried at render; pages become dynamic or ISR; cold-start + DB latency risk | Same as Payload |
| Lock-in | Low — content is plain YAML/Markdoc in git; drop Keystatic and the files remain | Medium — Markdown in git, but schema/query layer is Tina-specific | Medium-high — content in Sanity's store (exportable NDJSON, Portable Text) | Low-medium — your Postgres, Payload schema | None, but you own all the code |
| Fit with existing CI | Perfect — content edit = commit = existing lint/tsc/test/build run | Good, plus Tina build step and secrets in CI | Content changes bypass CI entirely (no tests guard content) | Content bypasses CI; migrations enter CI | Content bypasses CI |
| Thai/EN | No built-in i18n; model per-locale fields or per-locale entries | Same | Field-level i18n plugin | Built-in localization | Build it |
| Effort to adopt | ~7–10 days (mostly moving content + tests) | ~9–12 days (visual editing wiring per component) | ~10–14 days (schemas, GROQ, webhooks, draft mode) | ~12–16 days + ongoing DB ops | 15+ days + security maintenance |
| Main risk | Keystatic's Next 16 / React 19 support must be confirmed in a spike; smaller project than Sanity | Tina Cloud dependency at build; visual editing fights GSAP-animated sections | Runtime/build dependency on a third-party API; overkill for one editor | Heavy dependency footprint in a small static site; DB to run | Building and securing an admin is the whole project |

Decap CMS was considered and dropped: its React/Next App Router integration is dated, no TypeScript schema, and it offers nothing Keystatic doesn't. Contentful's free tier is restrictive and has the same CI-bypass problem as Sanity.

---

## 3. Recommendation: Keystatic, GitHub storage mode

1. **The content is small and structured.** About a dozen arrays and a handful of singletons. A git-backed form editor covers it; a hosted content platform is excess.
2. **SEO and motion are untouched.** Content is read from files at build time, so every page stays static, the "default state = final state" rule holds, and there is no runtime API in the render path.
3. **Edits stay safe.** Every save is a git commit, so the existing CI (`lint → tsc → test:run → build`) and Vercel Preview deployments validate content exactly like code. Today's data tests (`featured-work.test.tsx`, `projects-data.test.ts`, `structured-data.test.tsx`) keep guarding the content.
4. **Zero cost, lowest lock-in.** Content is YAML/Markdoc in the repo; removing Keystatic leaves readable files.
5. **Auth is free and narrow.** Only GitHub users with push access can edit; no new user database.

Choose **Sanity** instead if a non-developer will edit often, wants real-time preview without waiting for a preview build, or multiple editors appear (see open questions).

---

## 4. Implementation design (Keystatic)

### 4.1 File layout

```
keystatic.config.ts            # schema (collections + singletons)
app/keystatic/[[...params]]/page.tsx  + layout.tsx   # admin UI (client)
app/api/keystatic/[...params]/route.ts               # GitHub OAuth + commit API
lib/content/reader.ts          # createReader(process.cwd(), config) + typed getters
lib/content/schemas.ts         # zod schemas mirroring Keystatic, used by tests + getters
content/
  settings/site.yaml           # singleton
  settings/seo.yaml            # singleton
  projects/<slug>.yaml         # collection
  project-overrides/<repo>.yaml
  timeline/<id>.yaml
  faq/<nn-slug>.yaml
  services/<slug>.yaml  process/…  booking/…  capabilities/…
  resources/<slug>/index.mdoc  # collection with Markdoc body
  legal/<slug>/index.mdoc
public/assets/projects/        # images (unchanged location)
public/downloads/              # files (unchanged location)
```

Getters in `lib/content/` replace the current constants; components keep their props and markup. `lib/data/*.ts` become thin wrappers (or are deleted) so call sites change minimally.

### 4.2 Content model

**Singleton `site`** (replaces `PROFESSIONAL_INFO`, `SOCIAL_LINKS`, `RESUME_PATH`, parts of `EMPLOYMENT`/`EDUCATION`)
- `name`, `jobTitle`, `company`, `location`, `timezone`
- `email`, `github`, `linkedin`, `facebook` (url fields)
- `resume` (file field → `public/`), `openTo` (text)
- `heroConfig`: array of `{key, value}` (the `rachaphol.config.ts` block)

**Singleton `seo`**
- `personSummary` (text, required, ≤ ~300 chars) — used as home description, FAQ #1, JSON-LD, llms.txt
- `homeTitle`, `defaultTitle`, `defaultDescription`, `keywords[]`
- `knowsAbout[]`
- `pages`: array of `{path (select from known routes), title, description}` — consumed by a new `pageMetadataFor(path)` helper that wraps the existing `pageMetadata()`
- `manifestDescription`

**Collection `projects`** (featured case studies + curated extras; slug = filename)
- `title`, `githubRepoId` (integer), `githubUrl`, `liveUrl?`
- `description`, `problemStatement`, `solution`, `contribution?`, `designDecision?`, `outcome?`
- `featured` (checkbox), `order` (integer), `category` (select, current enum), `status` (select), `completedYear`
- `technologies[]`, `highlights[]`
- `image` (image field → `public/assets/projects/`), `screenshotAlt` (required when image set), `screenshotCaption`, `screenshotWidth`, `screenshotHeight`
- Validation: featured entries require `contribution`, `designDecision`, `outcome`, `image`.

**Collection `projectOverrides`** (slug = lowercase repo name)
- `title?`, `description?`, `liveUrlMode` (select: `keep` / `replace` / `remove`), `liveUrl?`, `verifiedOn` (date)

**Collection `timeline`**
- Current `TimelineItem` fields; `commit.hash/message/world` as an object field; `highlights[]`, `technologies[]` as arrays. `EMPLOYMENT`/`EDUCATION` are **derived** from it (removes the existing drift).

**Collection `faq`** — `question`, `answer` (plain text), `order`, `source` (select: `custom` / `personSummary`). `source: personSummary` renders `seo.personSummary`, preserving the "single sentence reused everywhere" rule without string interpolation. The email answer is written literally; a test asserts it contains `site.email`.

**Collections `services`, `processSteps`, `bookingSlots`, `bookingTopics`, `bookingPreparation`, `homeCapabilities`, `aboutCapabilities`** — one field per current object key plus `order`. Link fields (`example.href`, capability `href`) are text with a validation test that `#project-<slug>` targets an existing featured project.

**Collection `resources`** (for the Google Account checklist and future ones)
- `title`, `description` (meta), `lang` (select `en`/`th`), `kicker`, `intro`, `readOn` (date)
- `items`: array of `{title, detail, sourceUrl}`
- `sources`: array of `{title, url}`
- `downloads`: array of `{label, file (file field → public/downloads/), primary}`
- `disclaimer` (text)
- Rendered by one `app/resources/[slug]/page.tsx` with `generateStaticParams` + `dynamicParams = false`.

**Collection `legal`** (Vinly Fold privacy and future app policies)
- `product`, `title`, `updatedOn` (date), `contactEmail`, `bodyEn` (Markdoc), `bodyTh` (Markdoc), `urlPath` (text, e.g. `/vinly-fold/privacy`)
- Rendered by a minimal standalone route (no NavBar/Footer, matching today's page) — see migration notes for URL preservation.

### 4.3 How pages get content

- **Build-time reads.** Server components and route handlers call `lib/content/reader.ts` (`createReader` over the local filesystem). No `fetch`, no ISR needed for CMS content, because every edit is a commit that triggers a new Vercel deployment.
- **GitHub archive unchanged.** `/projects` keeps `fetchProjectsFromGitHub` with `revalidate: 3600`; `applyProjectOverrides` now takes `projects` + `projectOverrides` from content instead of constants.
- **Generated outputs.**
  - `llms.txt`: page list built from a route registry (static routes + `resources` + `legal` entries) instead of the hand-written list.
  - `sitemap.xml`: same registry; `lastModified` from the entry's `updatedOn`/`readOn` field or the build time, not request time.
  - JSON-LD: `siteGraph()` reads `site` + `seo`; FAQPage reads `faq`; ItemList unchanged.
- **Typing.** Wrap reader output with the zod schemas in `lib/content/schemas.ts` so components keep receiving today's `Project`/`TimelineItem`/`FaqItem` shapes.
- **Motion constraints.** Hero config `value` lengths still drive `steps(n)`; add a max length in the schema so the typing animation and layout don't break.

### 4.4 Images and files

- Keystatic `fields.image` with `directory: 'public/assets/projects'`, `publicPath: '/assets/projects/'` — images stay where they are and are served through `next/image` as today.
- `next/image` needs width/height: keep explicit `screenshotWidth/Height` fields and add a test that reads each file's real dimensions (`image-size`, dev dependency) and fails on mismatch. Alternative: compute at build — more code, defer.
- Size guard: test fails if a project image exceeds ~600 KB (the current `layer-3d.png` is 490 KB) to stop editors committing 5 MB PNGs.
- Downloads/résumé: `fields.file` into `public/downloads/` and `public/`. Version in filename (`-v1`) stays a convention.
- No remote image host needed, so `next.config.mjs` `remotePatterns` is untouched.

### 4.5 Admin auth and hardening

- **Local mode** for development (`storage: { kind: 'local' }` when `NODE_ENV=development`), **GitHub mode** in production (`kind: 'github', repo: 'naiplawan/portfolio'`).
- **Implemented gate:** `lib/content/admin.ts` serves 404 for `/keystatic` and `/api/keystatic` in production until all four env vars below exist, so CI and Vercel builds pass without secrets and local-mode writes never run on a server.
- Create a GitHub App via Keystatic's setup flow; env vars on Vercel only: `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. Access = repo write permission; nothing else to manage.
- `robots.txt`: disallow `/keystatic` and `/api/keystatic`; exclude from sitemap/llms; add `noindex` metadata on the admin layout.
- **CSP:** the global CSP in `next.config.mjs` may block the admin UI (GitHub API calls, inline styles). Add a narrower header rule for `/keystatic/:path*` rather than loosening the site-wide policy. Verify in the spike.
- Option to disable the admin on production entirely and edit only via local mode + PR (owner is a developer). Open question.

### 4.6 Editing, preview and CI flow

```
Edit in /keystatic (prod admin)
  └─ save to branch "content/<topic>"  → GitHub commit
       └─ GitHub Actions CI (lint, tsc, test:run, build)  + Vercel Preview URL
            └─ open/merge PR into main → Vercel production deploy
```

- Keystatic GitHub mode supports creating and switching branches from the admin; that gives draft + preview without draft-mode code.
- **CI already fits**: `.github/workflows/ci.yml` runs on every push and PR. Add one test file, `lib/content/__tests__/content.test.ts`, which parses every entry with the zod schemas and runs the cross-reference checks (FAQ email, `#project-<slug>` links, image dimensions/size, single `personSummary`, unique `order`). Content mistakes then fail CI before production.
- Recommend branch protection on `main` requiring the `Verify` check, so a bad content commit cannot deploy. Direct-to-main content saves are possible if the owner prefers speed (open question).
- The owner's agent pre-commit rules (changelog, commit review) apply to agent commits, not to admin saves; decide whether content commits need a CHANGELOG entry (suggest: no, content isn't release notes).

### 4.7 Migration of existing content

Mechanical and lossless; do it with a one-off script (`scripts/export-content.ts`, run with `tsx`, deleted after) that imports today's constants and writes YAML, then diff the rendered HTML before/after.

| From | To | Notes |
| --- | --- | --- |
| `FEATURED_PROJECTS` + ByteTrack | `content/projects/*.yaml` | `order` keeps current sequence; `id` → `githubRepoId` |
| `PROJECT_OVERRIDES` | `content/project-overrides/*.yaml` | `liveUrl: null` → `liveUrlMode: remove` |
| `timelineData` | `content/timeline/*.yaml` | derive `EMPLOYMENT`/`EDUCATION`; fix the title drift deliberately (owner picks) |
| `FAQ_ITEMS` | `content/faq/*.yaml` | first entry → `source: personSummary` |
| inline arrays in services, booking, SkillsSection, AboutMe | respective collections | |
| `PERSON_SUMMARY`, `KNOWS_ABOUT`, page metadata, layout defaults, manifest text | `settings/seo.yaml` | |
| constants identity | `settings/site.yaml` | |
| Google checklist page (other team) | `content/resources/google-account-checklist/` + generic route | **only after that work is merged**; URL unchanged |
| `public/vinly-fold/privacy/index.html` | `content/legal/vinly-fold-privacy/` + standalone route | confirm the URL in the Play Console first (`/vinly-fold/privacy/` vs `/vinly-fold/privacy/index.html`); keep both working (route + redirect) and delete the static file in the same change |

Verification for migration: snapshot the server-rendered HTML of `/`, `/about`, `/projects`, `/services`, `/booking`, `/llms.txt`, `/sitemap.xml` and the JSON-LD before and after; expect no text diffs except intentional fixes. Existing tests must pass unchanged or with only import-path updates.

### 4.8 Phased task list

| Phase | Scope | Verify | Effort |
| --- | --- | --- | --- |
| **0. Spike** | Install `@keystatic/core` + `@keystatic/next`; admin + API routes; local mode; confirm Next 16.2 / React 19.2 / TS 6 compatibility and `pnpm build`; check CSP and bundle size impact on public pages (admin must not ship to visitors) | Admin loads locally; production build size of `/` unchanged | 0.5–1 d |
| **1. Settings, SEO, FAQ** | `site` + `seo` singletons, `faq` collection, `lib/content` reader + zod schemas, content test; rewire `lib/seo.ts`, `constants.ts`, metadata exports, llms.txt, manifest, OG image | HTML/JSON-LD snapshot diff; tests green | 1–1.5 d |
| **2. Projects** | `projects` + `projectOverrides` collections, image fields, image dimension/size tests; rewire `featured-projects.ts`, `projects-data.ts`, `ProjectsSection` | `/` and `/projects` snapshot diff; GitHub-down fallback test still passes | 1.5–2 d |
| **3. Page sections** | `timeline` (derive EMPLOYMENT/EDUCATION), services, process, booking, capabilities, hero config; optional hero/about prose | snapshot diff; `#work-2` / `#project-*` link test | 1.5–2 d |
| **4. Resources, legal, discovery** | `resources` + `legal` collections, `app/resources/[slug]`, standalone legal route, route registry feeding sitemap + llms.txt, URL preservation for Vinly Fold. **Blocked on the other team's resources work landing on main** | Old URLs return 200 with same content; sitemap lists every page once | 1.5–2 d |
| **5. Production editing** | GitHub App, Vercel env vars, robots/noindex for admin, branch protection, short "how to edit" section in README | Edit from production admin on a branch → CI green → preview shows change → merge deploys | 0.5–1 d |
| **Total** | | | **≈ 7–10 days** |

Phases 1–3 can ship independently (each is a self-contained PR); phase 5 can move earlier if the owner wants to edit before migration is complete.

---

## 5. Open questions for the owner

1. **Who edits?** Only you (developer) → Keystatic, and maybe local-mode only with no production admin. A non-technical editor or several editors → reconsider Sanity.
2. **Budget:** is $0 a hard requirement, or is a paid hosted CMS acceptable for nicer preview?
3. **Thai/English:** stay English with occasional Thai-only pages (current state), or make the whole site bilingual? Full i18n changes the content model (per-locale fields) and routing (`/th/...`, `hreflang`) and should be decided before Phase 1.
4. **Resources and downloads in the CMS?** The Google Account checklist is owned by another team and uncommitted. Should resources become a CMS collection (recommended if more are planned), and who owns that route after migration?
5. **Privacy policies:** keep Vinly Fold's page as hand-maintained static HTML (it is legal text that rarely changes), or move it into the `legal` collection? What exact URL is registered in the Play Console?
6. **Publishing flow:** require a PR + green CI for every content change (safer), or allow direct commits to `main` from the admin (faster)? Enable branch protection on `main`?
7. **Scope of copy:** is it enough to move structured data (projects, FAQ, timeline, services, SEO), or do you also want hero/about prose and section headings editable?
8. **Vercel deployment sync:** live URLs are currently checked by hand against `vercel project ls`. Keep that manual (record `verifiedOn` in the CMS), or add a scheduled CI link check that flags dead `liveUrl`s?
9. **Career data drift:** which title is correct for Turfmapp — "Junior Full Stack Software Developer" or "Full Stack Software Developer"? (Needed to merge `EMPLOYMENT` into the timeline.)
10. **Résumé:** should uploading a new résumé PDF be possible from the CMS, or stay a code change?

---

## 6. Implementation status (branch `rachaphol/keystatic-cms`)

Done: phases 0, 1, 2, 3 and 5. Deviations from the design above, found while building:

- **Singletons as JSON instead of YAML collections.** Each editable area is one JSON file (`content/site.json`, `seo.json`, `faq.json`, `home.json`, `about.json`, `timeline.json`, `services.json`, `booking.json`, `project-overrides.json`), with lists as Keystatic arrays (drag to reorder, no `order` field). Static JSON imports keep `export const metadata` synchronous and need no filesystem access at runtime. `lib/content/index.ts` parses them with zod (server-only); client components read the raw `content/site.json` through `lib/constants.ts` so zod stays out of the browser bundle.
- **Projects are the one collection** (`content/projects/<slug>.json`, `order` field). Keystatic names images inside a singleton array by index (`items/0/image.png`) and renames them on reorder, so projects need a collection: its screenshots live at `public/assets/projects/<slug>/image.*`. The old screenshot URLs 308-redirect. `lib/content/projects.ts` reads the directory; `outputFileTracingIncludes` ships `content/` to the ISR functions.
- **No separate `resources`/`legal` collections and no route registry (phase 4 deferred).** The resources page, downloads and the Vinly Fold policy belong to another team's uncommitted work, and the registry would edit `app/sitemap.xml/route.ts`, which that work also changes.
- **Kept in code:** UI microcopy, section headings, the résumé PDF, the OG image tagline, and `EMPLOYMENT`/`EDUCATION` in `lib/constants.ts`. The Turfmapp title mismatch was resolved from the résumé PDF ("Full Stack Software Developer", Jan 2024 – Jan 2025), and a content test now fails if `EMPLOYMENT` titles drift from the timeline.
- **Production gate:** `/keystatic` and `/api/keystatic` return 404 in production until all four GitHub App env vars exist. `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` switches `next dev` to GitHub mode for the one-time app setup.
- **PR-gating needs branch protection.** Keystatic can commit straight to `main` for anyone with push access. Only a protected `main` (require a PR and the `Verify` check) forces edits through `content/*` branches.

---

## 7. Switch to Go + Postgres on Railway (branch `rachaphol/go-cms`, stacked on `rachaphol/keystatic-cms`)

The owner chose to store content in Postgres behind a Go backend on Railway. Keystatic is removed. The content extraction from sections 4 and 6 (JSON documents, zod schemas, loaders, tests) carries over unchanged.

| Decision | Choice | Why |
| --- | --- | --- |
| Service | Go + Fiber v3 in `backend/` of this repo | Matches the owner's Go Fiber stack; one repo keeps schemas and seed data together |
| Database | Railway Postgres; `documents` and `projects` as `json` (exact text), plus `revisions` | Same shapes as `content/`, no per-field tables to migrate; every write is recoverable |
| Validation | JSON Schemas generated from zod (`pnpm content:schemas`) | One source of rules; a test fails if the Go copy is stale |
| Site rendering | `pnpm build` pulls `GET /api/content` into `content/`, then builds | Pages stay fully static and nothing else in the app changes; a failed pull fails the build, so Vercel keeps the last deployment |
| Publishing | The API calls a Vercel deploy hook 30 s after the last save | Batches edits into one rebuild (≈1–2 min to go live) |
| Admin | `/admin` in the Next app: password login (bcrypt in Go, per-client lockout), HMAC session token in an httpOnly cookie, JSON editors checked with zod; the admin API only accepts requests carrying `ADMIN_PROXY_SECRET` (from the Next server) | Smallest secure surface; forms per field are a follow-up |
| Images | Stay in `public/assets/projects/<slug>/` in git; the build refuses missing files | Uploads to R2/S3 are a follow-up |
| CI | New `Backend` job: gofmt, `go vet`, `go test -race` against a Postgres service, build | Existing `Verify` job is unchanged and still builds from the committed snapshot |

**Owner setup:** see `backend/README.md` → "Deploying on Railway". In short: a Railway service with root directory `/backend`, a Postgres database, and the `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `ADMIN_PROXY_SECRET` and `VERCEL_DEPLOY_HOOK_URL` variables, then seed. Finally set `CONTENT_API_URL` and the same `ADMIN_PROXY_SECRET` on Vercel.

**Follow-ups, not done:**
- Form-based editors per field.
- Image uploads to R2/S3.
- A revisions browser in the admin.
- Phase 4 (resources, legal pages, route registry), still waiting for the other team's work.
- Adding the `Backend` check to `main`'s required checks once this PR is merged.
