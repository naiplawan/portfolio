import { FaqStructuredData } from '@/components/seo/structured-data'
import { SectionHeading } from '@/components/ui/section-heading'
import { FAQ_ITEMS } from '@/lib/data/faq-data'

/**
 * Quick answers about Rachaphol, written to be quoted by search snippets and AI
 * answer engines. The FAQPage JSON-LD is generated from the same visible text.
 */
export default function FaqSection({ index }: { index?: string }) {
  return (
    <section className="section-padding" aria-labelledby="faq-title">
      <div className="container-premium">
        <SectionHeading index={index} label="FAQ" title={<span id="faq-title">Quick answers</span>} />

        <dl className="border-t border-[hsl(var(--rule))]">
          {FAQ_ITEMS.map(({ question, answer }) => (
            <div
              key={question}
              className="grid gap-2 border-b border-[hsl(var(--rule))] py-6 md:grid-cols-[2fr_3fr] md:gap-10"
            >
              <dt className="font-display text-lg font-semibold tracking-tight">{question}</dt>
              <dd className="leading-relaxed text-muted-foreground">{answer}</dd>
            </div>
          ))}
        </dl>

        <FaqStructuredData items={FAQ_ITEMS} />
      </div>
    </section>
  )
}
