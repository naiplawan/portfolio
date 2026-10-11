# Claude Development Guide - Portfolio Project

## Project Overview

A portfolio website built with Next.js 16, React 19, TypeScript, and Tailwind CSS 3.4. The design is **minimal editorial**: typography-led, hairline rules instead of cards, one accent color, and almost no decoration.

## Design System

### Color Palette (Editorial)

HSL tokens live in `app/globals.css` (`:root` and `.dark`):

```css
/* Light — warm paper, ink, vermilion */
--background: 40 23% 97%;
--foreground: 30 10% 9%;
--primary: 30 10% 9%;          /* ink; primary === foreground */
--muted-foreground: 30 6% 38%;
--accent: 11 76% 45%;          /* vermilion — the only color */
--border / --rule: 35 12% 85%;

/* Dark — warm charcoal */
--background: 30 6% 7%;
--foreground: 40 15% 91%;
--accent: 14 85% 62%;
```

`--success` and `--destructive` exist for form states only.

### Design Tokens

- Radius: `--radius` is `0.25rem`; use `rounded-lg`
- No shadows, no glassmorphism, no gradients
- Fonts: `font-display` (Instrument Serif) for headings, Inter for body, `font-mono` (JetBrains Mono) for labels and metadata

### Building Blocks

- `SectionHeading` (`components/ui/section-heading.tsx`): ruled mono kicker (optional index + label) above a serif title. Use `as="h1"` on subpage heroes.
- Lists over cards: `<ol>`/`<dl>` rows separated by `border-[hsl(var(--rule))]`
- Utility classes in `globals.css`:
  - `container-premium`: page width + gutters
  - `section-padding`: vertical rhythm (don't combine with `pt-0`/`pb-0`; use explicit `pt-[clamp(...)]` instead)
  - `section-label`, `index-num`, `mono-tag`: mono kicker/metadata text
  - `ed-link`: hairline-underlined text link that turns accent on hover
- Primary action: `inline-flex h-11 items-center rounded-lg bg-foreground px-5 text-background`; secondary action: `ed-link`

## Code Conventions

### Import Order
1. React and core libraries
2. Third-party libraries (framer-motion, lucide-react)
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

### Dark Mode
- Toggle component: `components/ui/dark-mode-toggle.tsx`
- Uses CSS custom properties for seamless switching
- All components must support both light and dark modes

### Animations
- Keep motion minimal: hover color/transform transitions, the hero `animate-fade-up`, the mobile menu fade
- `MotionConfig reducedMotion="user"` in `components/layout/providers.tsx` and a global CSS rule respect `prefers-reduced-motion`

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
- `framer-motion`: ^12
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
