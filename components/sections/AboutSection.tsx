import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { LevelMap } from '@/components/motion/LevelMap'
import { RevealRows } from '@/components/motion/RevealRows'
import { SectionHeading } from '@/components/ui/section-heading'
import { cn } from '@/lib/utils/cn'
import { formatTimelinePeriod, getTimelineSorted } from '@/lib/data/timeline-data'

export default function AboutSection() {
  const timeline = getTimelineSorted()

  return (
    <section className="section-padding">
      <div className="container-premium">
        <SectionHeading index="03" label="About" title="From pipette to pull request" />

        <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              I studied Biological Sciences at Mahidol University: titrations,
              microscopes, lab notebooks. In 2023 I traded the bench for a
              keyboard through an intensive bootcamp.
            </p>
            <p>
              The method carried over. A bug is an unexpected result; a fix is a
              controlled experiment. Today I build product interfaces with React,
              Next.js and TypeScript, and work across Go APIs and Flutter apps
              when the product calls for it.
            </p>
            <Link
              href="/about"
              className="ed-link inline-flex items-center gap-1 text-base text-foreground"
            >
              More about me
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <p className="mb-4 font-mono text-sm text-muted-foreground">
              <span className="text-[hsl(var(--accent))]">$</span> git log --graph career
            </p>
            <LevelMap>
              <RevealRows rows="li">
                <ol>
                  {timeline.map((item, index) => {
                    const isHead = index === 0
                    return (
                      <li key={item.id} className="relative grid grid-cols-[2.25rem_1fr] py-5">
                        <span
                          className={cn(
                            'relative z-0 ml-[6px] mt-1.5 h-[10px] w-[10px] border-2 border-[hsl(var(--accent))]',
                            isHead ? 'bg-[hsl(var(--accent))]' : 'bg-background'
                          )}
                          aria-hidden="true"
                        />
                        <div className="border-b border-[hsl(var(--rule))] pb-5">
                          <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                            <span>
                              <span className="text-[hsl(var(--accent))]">{item.commit.hash}</span>
                              {isHead && <span> (HEAD -&gt; main)</span>}
                            </span>
                            <span className="pixel-label">world {item.commit.world}</span>
                          </p>
                          <p className="mt-1.5 font-mono text-sm text-foreground">{item.commit.message}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.title}, {item.organization} · {formatTimelinePeriod(item)}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </RevealRows>
            </LevelMap>
          </div>
        </div>
      </div>
    </section>
  )
}
