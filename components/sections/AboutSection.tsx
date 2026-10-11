import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { formatTimelinePeriod, getTimelineSorted } from '@/lib/data/timeline-data'

export default function AboutSection() {
  const timeline = getTimelineSorted()

  return (
    <section className="section-padding">
      <div className="container-premium">
        <SectionHeading index="03" label="About" title="From biology lab to product teams" />

        <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              I studied Biological Sciences at Mahidol University, then moved
              into software through an intensive bootcamp in 2023. The habit of
              testing assumptions carried over.
            </p>
            <p>
              Today I build product interfaces with React, Next.js and
              TypeScript, and work across Go APIs and Flutter apps when the
              product calls for it.
            </p>
            <Link
              href="/about"
              className="ed-link inline-flex items-center gap-1 text-base text-foreground"
            >
              More about me
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <ol className="border-t border-[hsl(var(--rule))]">
            {timeline.map((item) => (
              <li
                key={item.id}
                className="grid gap-1 border-b border-[hsl(var(--rule))] py-5 sm:grid-cols-[11rem_1fr] sm:gap-6"
              >
                <span className="mono-tag pt-1">{formatTimelinePeriod(item)}</span>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.organization}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
