import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { PROFESSIONAL_INFO } from '@/lib/constants'

const facts = [
  { term: 'Now', detail: `${PROFESSIONAL_INFO.title}, ${PROFESSIONAL_INFO.company}` },
  { term: 'Stack', detail: 'React, Next.js, TypeScript, Go, Flutter' },
  { term: 'Based', detail: PROFESSIONAL_INFO.location },
  { term: 'Open to', detail: 'Freelance and full-time roles' },
]

export default function DeveloperHero() {
  return (
    <section className="container-premium pt-16 sm:pt-28">
      <div className="animate-fade-up">
        <p className="section-label mb-8">
          {PROFESSIONAL_INFO.name} — {PROFESSIONAL_INFO.title}
        </p>

        <h1 className="max-w-5xl text-balance font-display text-[clamp(2.75rem,8.5vw,6.5rem)] leading-[0.95] tracking-[-0.035em]">
          I build fast, accessible interfaces for the{' '}
          <span className="italic text-[hsl(var(--accent))]">web</span> and{' '}
          <span className="italic text-[hsl(var(--accent))]">mobile</span>.
        </h1>

        <div className="mt-10 grid gap-8 sm:mt-14 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Frontend developer at {PROFESSIONAL_INFO.company} in Bangkok. I turn
            product requirements into clear, maintainable software — and reach
            into Go and Flutter when a product needs continuity beyond the
            browser.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link
              href="#projects"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-background transition-opacity hover:opacity-85"
            >
              Selected work
              <ArrowDown className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="ed-link inline-flex items-center gap-1">
              Get in touch
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <dl className="mt-16 grid grid-cols-1 border-t border-[hsl(var(--rule))] sm:mt-24 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map(({ term, detail }) => (
          <div
            key={term}
            className="flex gap-4 border-b border-[hsl(var(--rule))] py-4 sm:block sm:pr-6 lg:border-b-0"
          >
            <dt className="section-label w-20 shrink-0 sm:mb-2 sm:w-auto">{term}</dt>
            <dd className="text-sm">{detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
