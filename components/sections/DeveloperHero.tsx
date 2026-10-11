import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { MitosisHero } from '@/components/motion/MitosisHero'
import { PROFESSIONAL_INFO } from '@/lib/constants'

const config = [
  { key: 'role', value: `"${PROFESSIONAL_INFO.title} @ Unixdev"` },
  { key: 'stack', value: '[react, next, typescript, go, flutter]' },
  { key: 'based', value: '"Bangkok, TH"' },
  { key: 'formerly', value: '"B.Sc. Biological Sciences, Mahidol"' },
  { key: 'open_to', value: '"freelance + full-time"' },
]

export default function DeveloperHero() {
  return (
    <section className="container-premium pt-12 sm:pt-20">
      <div className="grid gap-10 md:grid-cols-[1fr_minmax(0,22rem)] md:items-center lg:gap-16">
        <div className="animate-fade-up">
          <p className="mb-8 font-mono text-sm text-muted-foreground">
            <span className="text-[hsl(var(--accent))]">~/rachaphol</span> $ whoami
            <span className="pixel-cursor" aria-hidden="true" />
          </p>

          <h1 className="max-w-4xl text-balance font-display text-[clamp(2.5rem,7vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            Biologist turned{' '}
            <span className="text-[hsl(var(--accent))]">developer</span>.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            I debug interfaces the way I used to run experiments: form a
            hypothesis, change one variable, measure. Today that means React,
            Next.js and TypeScript at {PROFESSIONAL_INFO.company}, with Go and
            Flutter when a product needs them.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link
              href="#projects"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-background transition-opacity hover:opacity-85"
            >
              <span className="pixel-label">▶ Selected work</span>
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="ed-link inline-flex items-center gap-1">
              Get in touch
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <MitosisHero className="pixelated mx-auto w-full max-w-[18rem] md:max-w-none" />
      </div>

      <div className="mt-14 border-t border-[hsl(var(--rule))] pt-4 sm:mt-20">
        <p className="pixel-label mb-3 text-muted-foreground">rachaphol.config.ts</p>
        <dl className="grid gap-x-6 gap-y-1 font-mono text-sm sm:grid-cols-[auto_1fr]">
          {config.map(({ key, value }) => (
            <div key={key} className="contents">
              <dt className="text-[hsl(var(--accent))]">{key}:</dt>
              <dd className="mb-2 break-words text-foreground sm:mb-0">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
