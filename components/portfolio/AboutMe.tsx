import { SectionHeading } from '@/components/ui/section-heading'
import { ABOUT } from '@/lib/content'

const { paragraphs, capabilities } = ABOUT

export default function AboutMe() {
  return (
    <section className="section-padding">
      <div className="container-premium">
        <SectionHeading as="h1" label="About" title="Product-minded frontend development" />

        <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-20">
          <div className="space-y-6 text-xl leading-relaxed">
            {paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index > 0 ? 'text-muted-foreground' : undefined}>
                {paragraph}
              </p>
            ))}
          </div>

          <dl className="border-t border-[hsl(var(--rule))]">
            {capabilities.map(({ title, description }) => (
              <div key={title} className="border-b border-[hsl(var(--rule))] py-5">
                <dt className="section-label mb-2">{title}</dt>
                <dd className="leading-relaxed text-muted-foreground">{description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
