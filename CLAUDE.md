# Claude Development Guide - Portfolio Project

## Project Overview

A modern, production-ready portfolio website built with Next.js 15, React 19, TypeScript, and Tailwind CSS. The project emphasizes design consistency, accessibility, and performance with a premium organic design system.

## Design System

### Color Palette (Premium Organic Theme)

The design uses a warm, earthy color palette with HSL tokens for consistent theming:

```css
/* Light Mode */
--primary: 28 50% 45%;        /* Rich terracotta #C97C4C */
--secondary: 35 30% 72%;      /* Warm sand #D4B896 */
--accent: 105 20% 65%;        /* Muted sage #9DB89A */
--success: 145 55% 42%;       /* Sage green for success states */
--destructive: 0 65% 45%;     /* Red for errors */
--muted: 45 20% 90%;          /* Subtle backgrounds */
--background: 45 30% 97%;     /* Ultra warm cream */
--foreground: 25 15% 15%;     /* Near black */

/* Dark Mode */
--primary: 26 60% 58%;        /* Warm terracotta glow #D99268 */
--secondary: 25 20% 20%;      /* Warm dark gray */
--accent: 105 18% 32%;        /* Deep sage */
--success: 145 45% 52%;       /* Lighter sage green */
--background: 22 15% 7%;      /* Deep warm charcoal */
--foreground: 40 10% 95%;     /* Soft white */
```

### Design Tokens

#### Border Radius
- Standard: `rounded-lg` (1.25rem / 20px)
- Derived from CSS variable: `var(--radius)`

#### Shadows (CSS Variables)
- `--bio-shadow-soft`: Subtle elevation
- `--bio-shadow-medium`: Medium elevation
- `--bio-shadow-inner`: Inset depth effect
- `--glass-shadow`: Glassmorphism shadows

#### Animation Durations
- `--duration-instant`: 100ms
- `--duration-fast`: 200ms
- `--duration-normal`: 300ms (default)
- `--duration-moderate`: 400ms
- `--duration-slow`: 600ms
- `--duration-slower`: 800ms

#### Easing Curves
- `--ease-out-expo`: Exponential ease-out
- `--ease-out-quart`: Quartic ease-out
- `--ease-in-out`: Standard smooth transition
- `--ease-spring`: Spring-like motion

### Component Variants

#### Button Variants
- `default`: Primary terracotta background
- `premium`: Uses `bio-button` class with glassmorphism
- `outline`: Bordered style
- `secondary`: Warm sand background
- `ghost`: Hover-only background
- `link`: Text link with underline

#### Card Variants
- `default`: Standard card with soft shadow
- `glass`: Uses `bio-glass-card` class
- `elevated`: Higher elevation with glow effect

#### Input Variants
- `default`: Standard bordered input
- `premium`: Uses `bio-input` class with enhanced focus states

### Utility Classes

#### Glassmorphism
```tsx
className="bio-glass-card"
// Background blur, border, shadow, hover effects
```

#### Gradient Text
```tsx
className="bio-gradient-text"
// Primary → Accent → Secondary gradient
```

#### Premium Button
```tsx
className="bio-button"
// Gradient background, shadow, hover lift
```

#### Section Spacing
```tsx
className="section-padding"
// Responsive padding: 4rem (mobile) to 8rem (desktop)
```

## Code Conventions

### Import Order
1. React and core libraries
2. Third-party libraries (framer-motion, lucide-react)
3. Local components (use @/ prefix)
4. Utils and helpers
5. Types and interfaces

### Component Structure
```tsx
'use client' // Only if using client-side features

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ComponentProps {
  // Props definition
}

export function Component({ prop }: ComponentProps) {
  // Hooks
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Handlers
  const handleClick = () => {}

  // Effects
  useEffect(() => {}, [])

  // Render
  return (
    <section className="section-padding">
      {/* Content */}
    </section>
  )
}
```

### Styling Guidelines

1. **Always use design tokens** - Never hardcode colors
   ```tsx
   // ✅ Good
   className="text-primary bg-accent"

   // ❌ Bad
   className="text-orange-500 bg-green-200"
   ```

2. **Use semantic border radius**
   ```tsx
   // ✅ Good
   className="rounded-lg"

   // ❌ Bad
   className="rounded-md rounded-xl"
   ```

3. **Use animation tokens**
   ```tsx
   // ✅ Good
   transition={{ duration: 0.3 }}
   className="transition-all duration-normal"

   // ❌ Avoid
   transition={{ duration: 342 }}
   ```

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
- Uses form validation with real-time feedback
- Success/error states use `success` and `destructive` color tokens
- Form submission uses POST to contact endpoint

### Dark Mode
- Toggle component: `components/ui/dark-mode-toggle.tsx`
- Uses CSS custom properties for seamless switching
- All components must support both light and dark modes

### Animations
- Use Framer Motion for complex animations
- Keep animations subtle and professional
- Respect `prefers-reduced-motion` for accessibility

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

- `next`: ^15.1.6
- `react`: ^19.0.0
- `framer-motion`: ^11.15.0
- `tailwindcss`: ^4.0.0
- `@radix-ui/*`: Component primitives
- `lucide-react`: Icon system
- `class-variance-authority`: Component variants

## Common Tasks

### Adding a New Section
1. Create component in `components/sections/`
2. Use `section-padding` for container
3. Add animation with `useInView` hook
4. Export from section and import in page

### Adding a New UI Component
1. Create in `components/ui/`
2. Use CVA for variants if needed
3. Support both light and dark modes
4. Add proper TypeScript types
5. Export for reuse

### Updating Colors
1. Modify HSL values in `app/globals.css`
2. Update both `:root` and `.dark` sections
3. No need to update Tailwind config (uses CSS vars)

## Performance Considerations

- Images: Use Next.js `<Image>` component
- Dynamic imports: Use for heavy components
- Code splitting: Automatic with App Router
- Bundle size: Monitor with `pnpm build`
