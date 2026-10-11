import { SectionHeading } from '@/components/ui/section-heading';
import { formatTimelinePeriod, getTimelineSorted } from '@/lib/data/timeline-data';

export default function Timeline() {
  const timelineItems = getTimelineSorted();

  return (
    <section className="pb-[clamp(4rem,10vw,8rem)]">
      <div className="container-premium">
        <SectionHeading label="Experience" title="Career so far" />

        <ol className="border-t border-[hsl(var(--rule))]">
          {timelineItems.map((item) => (
            <li
              key={item.id}
              className="grid gap-4 border-b border-[hsl(var(--rule))] py-8 md:grid-cols-[14rem_1fr] md:gap-10 md:py-10"
            >
              <div className="space-y-1">
                <p className="mono-tag">{formatTimelinePeriod(item)}</p>
                {item.location && <p className="mono-tag">{item.location}</p>}
              </div>

              <div className="max-w-3xl">
                <h3 className="font-display text-2xl tracking-tight sm:text-3xl">{item.title}</h3>
                <p className="mt-1 text-muted-foreground">{item.organization}</p>
                <p className="mt-4 leading-relaxed">{item.description}</p>

                {item.highlights && item.highlights.length > 0 && (
                  <ul className="mt-4 space-y-2 text-muted-foreground">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span aria-hidden="true">–</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {item.technologies && item.technologies.length > 0 && (
                  <p className="mono-tag mt-5">{item.technologies.join(' · ')}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
