# Claude Development Guide - Portfolio Project

## Project Overview

A portfolio website built with Next.js 16, React 19, TypeScript, and Tailwind CSS 3.4. The design is **lab notebook meets terminal**: a developer site that keeps the owner's biology background visible, with pixel-game accents. Typography-led, hairline rules instead of cards, one accent color, flat pixel art instead of decoration.

## Design System

### Color Palette

HSL tokens live in `app/globals.css` (`:root` and `.dark`):

```css
/* Light — warm paper, ink, chlorophyll green */
--background: 40 23% 97%;
--foreground: 30 10% 9%;
--primary: 30 10% 9%;          /* ink; primary === foreground */
--muted-foreground: 30 6% 38%;
--accent: 142 64% 28%;         /* chlorophyll — the only color (5.4:1 on paper) */
--border / --rule: 35 12% 85%;

/* Dark — warm charcoal */
--background: 30 6% 7%;
--foreground: 40 15% 91%;
--accent: 142 55% 55%;         /* 9.1:1 on charcoal */
```

`--success` and `--destructive` exist for form states only. `--pixel-skin`, `--pixel-hair` and `--pixel-coat` exist only for sprites.

### Design Tokens

- Radius: `--radius` is `0.25rem`; use `rounded-lg`
- No shadows, no glassmorphism, no gradients
- Fonts: `font-display` (Geist, semibold) for headings, Inter for body, `font-mono` (JetBrains Mono) for metadata and code-like text, `font-pixel` (Silkscreen) for short labels and buttons only — never body copy
- No italics (Geist has none)

### Building Blocks

- `SectionHeading` (`components/ui/section-heading.tsx`): ruled kicker (pixel `[01]` index + decoded `// label`) above a sans title. Use `as="h1"` on subpage heroes.
- Biology voice: projects are lab entries (hypothesis / method / result), skills are a character sheet grouped by kingdom, career is a `git log` (biology degree = `initial commit`).
- Lists over cards: `<ol>`/`<dl>` rows separated by `border-[hsl(var(--rule))]`
- Utility classes in `globals.css`:
  - `container-premium`: page width + gutters
  - `section-padding`: vertical rhythm (don't combine with `pt-0`/`pb-0`; use explicit `pt-[clamp(...)]` instead)
  - `section-label`, `index-num`, `mono-tag`: mono kicker/metadata text
  - `ed-link`: hairline-underlined text link that turns accent on hover
  - `pixel-label`: Silkscreen kicker; `code-comment`: prefixes `// ` in accent
  - `pixel-border`: stepped 2px frame with clipped corners; `pixel-cursor`: blinking block cursor; `pixelated`: crisp scaling for sprite SVGs
- Primary action: `inline-flex h-11 items-center rounded-lg bg-foreground px-5 text-background` with a `pixel-label` text; secondary action: `ed-link`

### Pixel Art

- Sprites are character grids in `components/pixel/sprites.ts`; each character maps to a `.px-*` fill class in `globals.css` (kept outside `@layer` so Tailwind doesn't purge the dynamic class names)
- Render with `PixelSprite` (standalone `<svg>`) or `PixelGroup` (`<g>` inside a scene). `PixelGroup` puts its x/y offset on an inner group so GSAP can transform the outer one
- `components/pixel/__tests__/sprites.test.ts` checks every grid is rectangular and uses palette characters — add new sprites there

## Code Conventions

### Import Order
1. React and core libraries
2. Third-party libraries (gsap, lucide-react)
3. Local components (use @/ prefix)
4. Utils and helpers
5. Types and interfaces

### Component Structure
```tsx
// Server component by default; add 'use client' only for state/effects
import { SectionHeading } from '@/components/ui/section-heading'

interface ComponentProps {
  // Props definition
}

export function Component({ prop }: ComponentProps) {
  return (
    <section className="section-padding">
      <div className="container-premium">
        <SectionHeading index="01" label="Label" title="Title" />
        {/* Content */}
      </div>
    </section>
  )
}
```

### Styling Guidelines

1. **Always use design tokens** - Never hardcode colors
   ```tsx
   // ✅ Good
   className="text-foreground text-[hsl(var(--accent))]"

   // ❌ Bad
   className="text-orange-500 bg-green-200"
   ```

2. **Use semantic border radius** — `rounded-lg` (or `rounded-full` for icon buttons)

3. **Content must render without JS** — never hide content behind `whileInView`/`useInView` reveals. For an entrance, use the CSS `animate-fade-up` class.

4. **Section spacing**
   ```tsx
   // ✅ Good
   <section className="section-padding">

   // ❌ Bad
   <section className="py-20 lg:py-32">
   ```

### File Naming

- Components: `PascalCase.tsx` (e.g., `NavBar.tsx`, `ContactSection.tsx`)
- Utilities: `kebab-case.ts` (e.g., `cn.ts`, `github-sync.ts`)
- Types: `kebab-case.ts` (e.g., `blog-types.ts`)
- Pages: `kebab-case` folder with `page.tsx`

## Project-Specific Patterns

### GitHub Integration
- Projects are fetched from GitHub API via `/api/github/projects`
- Falls back to `FALLBACK_PROJECTS` in `lib/data/projects-data.ts`
- Environment variable: `NEXT_PUBLIC_GITHUB_USERNAME`

### Contact Form
- Client-side validation, honeypot field, and a localStorage rate limiter
- Sends via EmailJS (`NEXT_PUBLIC_EMAILJS_*` env vars); shows a fallback notice when unset
- Success/error states use `success` and `destructive` color tokens
- `?subject=` query param prefills the message (used by Booking and Services links)

### SEO, AEO and GEO
- Site URL comes from `SITE_URL` (`lib/constants.ts`, `NEXT_PUBLIC_APP_URL` or `https://rachaphol.vercel.app`); never hardcode a domain
- Every page exports `metadata = pageMetadata({ title, description, path })` from `lib/seo.ts` (canonical + OG + Twitter). Client pages put it in a sibling `layout.tsx` (see `app/contact`)
- JSON-LD lives in `components/seo/structured-data.tsx`: one Person/WebSite graph in the root layout (stable `@id`s in `SCHEMA_IDS`), plus ProfilePage + FAQPage on home, ItemList on `/projects`, BreadcrumbList on subpages. Never add a second Person
- FAQ answers (`lib/data/faq-data.ts`) are written in the third person, self-contained, and reused verbatim for the visible section, FAQPage and `llms.txt`
- `/llms.txt` is generated from site data; `robots.txt` explicitly allows search and AI crawlers and blocks only `/api/`; add new pages to `app/sitemap.xml/route.ts`
- Project names/descriptions/live URLs that GitHub gets wrong go in `PROJECT_OVERRIDES` (`lib/data/projects-data.ts`)

### Dark Mode
- Toggle component: `components/ui/dark-mode-toggle.tsx`
- Uses CSS custom properties for seamless switching
- All components must support both light and dark modes

### Animations (GSAP)
- Motion assets live in `components/motion/` as small client components; import `gsap`, `useGSAP`, `MOTION_OK` and `stepped()` from `components/motion/gsap.ts` (plugins are registered there)
- Every timeline runs inside `gsap.matchMedia().add(MOTION_OK, …)` and reverts on unmount
- **Default state = final state.** The server render is the finished frame (bars full, text visible, sprite standing). Animate *from* other states; never hide content until JS runs
- Decorative art that must not flash its final frame gets `data-motion-pending`; it stays hidden only while `html.motion-ok` is set (inline `<head>` script) and GSAP reveals it with `autoAlpha`
- Use `stepped(n)` / `steps()` easing for the 8-bit feel; CSS transitions can use `[transition-timing-function:steps(2)]`
- Current assets: `MitosisHero` (intro, idle, eye tracking, parallax, replay), `DecodeText` (section labels), `XpFill`, `RevealRows` (stepped scanline wipe for list rows), `LevelMap` (walker), `DnaDivider`, `AmbientCells` (margin cells, ≥1360px), `SpecimenScene` (404), `KonamiCode`
- Above-the-fold text animates with CSS only (`animate-pixel-in`, `animate-type-line` with inline `steps(<chars>)`), so it renders and animates without JS; the reduced-motion rule zeroes durations and delays
- Pressable buttons get `active:translate-y-px`; hover sprites use `group-hover:animate-pixel-wiggle`
- A global CSS rule also neutralises CSS animations under `prefers-reduced-motion`

## Development Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production
pnpm start

# Lint
pnpm lint

# Type check
pnpm tsc --noEmit
```

## Key Dependencies

- `next`: ^16
- `react`: ^19.2
- `gsap` / `@gsap/react`: ^3.15 / ^2.1
- `tailwindcss`: 3.4.17
- `@radix-ui/*`: Component primitives
- `lucide-react`: Icon system
- `class-variance-authority`: Component variants

## Common Tasks

### Adding a New Section
1. Create component in `components/sections/` (server component unless it needs state)
2. Wrap in `section-padding` + `container-premium`
3. Start with `SectionHeading`
4. Import it in the page

### Adding a New UI Component
1. Create in `components/ui/`
2. Use CVA for variants if needed
3. Support both light and dark modes
4. Add proper TypeScript types

### Updating Colors
1. Modify HSL values in `app/globals.css`
2. Update both `:root` and `.dark` sections
3. No need to update Tailwind config (uses CSS vars)

## Performance Considerations

- Images: Use Next.js `<Image>` component
- Dynamic imports: Use for heavy components
- Code splitting: Automatic with App Router
- Bundle size: Monitor with `pnpm build`
