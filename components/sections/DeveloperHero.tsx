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

const headline = [
  { word: 'Biologist', accent: false },
  { word: 'turned', accent: false },
  { word: 'developer', accent: true },
]

// CSS-only entrance so the hero still renders (and animates) without JS
const HEADLINE_START = 450
const WORD_STAGGER = 160
const CONFIG_START = 1100
const LINE_STAGGER = 140

/** Typing-style entrance: clips the line open one character per step. */
const typed = (text: string, delay: number) => ({
  animationDelay: `${delay}ms`,
  animationTimingFunction: `steps(${Math.max(text.length, 1)}, end)`,
})

export default function DeveloperHero() {
  return (
    <section className="container-premium pt-12 sm:pt-20">
      <div className="grid gap-10 md:grid-cols-[1fr_minmax(0,22rem)] md:items-center lg:gap-16">
        <div className="animate-fade-up">
          <p className="mb-8 font-mono text-sm text-muted-foreground">
            <span className="inline-block animate-type-line" style={typed('~/rachaphol $ whoami', 0)}>
              <span className="text-[hsl(var(--accent))]">~/rachaphol</span> $ whoami
            </span>
            <span className="pixel-cursor" aria-hidden="true" />
          </p>

          <h1 className="max-w-4xl text-balance font-display text-[clamp(2.5rem,7vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            {headline.map(({ word, accent }, i) => (
              <span key={word}>
                <span
                  className={`inline-block animate-pixel-in ${accent ? 'text-[hsl(var(--accent))]' : ''}`}
                  style={{ animationDelay: `${HEADLINE_START + i * WORD_STAGGER}ms` }}
                >
                  {word}
                  {i === headline.length - 1 && <span className="text-foreground">.</span>}
                </span>
                {i < headline.length - 1 && ' '}
              </span>
            ))}
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
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-background transition-[opacity,transform] hover:opacity-85 active:translate-y-px"
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
          {config.map(({ key, value }, i) => {
            const delay = CONFIG_START + i * LINE_STAGGER
            return (
              <div key={key} className="contents">
                <dt className="animate-type-line text-[hsl(var(--accent))]" style={typed(`${key}:`, delay)}>
                  {key}:
                </dt>
                <dd
                  className="mb-2 animate-type-line break-words text-foreground sm:mb-0"
                  style={typed(value, delay + 80)}
                >
                  {value}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
