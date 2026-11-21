import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { RevealRows } from '@/components/motion/RevealRows'
import { SectionHeading } from '@/components/ui/section-heading'
import { HOME } from '@/lib/content'

const capabilities = HOME.capabilities

export default function SkillsSection() {
  return (
    <section className="section-padding">
      <div className="container-premium">
        <SectionHeading index="02" label="Capabilities" title="What I build, and where">
          Field notes from projects and product teams. Follow the examples to
          see these tools in use.
        </SectionHeading>

        <RevealRows rows=".capability">
          <div className="grid gap-x-12 sm:grid-cols-2">
            {capabilities.map((capability) => (
              <section key={capability.name} className="capability border-t border-[hsl(var(--rule))] py-6">
                <h3 className="font-display text-2xl tracking-tight">{capability.name}</h3>
                <p className="mt-3 font-mono text-xs leading-relaxed text-[hsl(var(--accent))]">{capability.tools}</p>
                <p className="mt-4 leading-relaxed text-muted-foreground">{capability.evidence}</p>
                <Link href={capability.href} className="ed-link mt-5 inline-flex items-center gap-1 text-sm">
                  {capability.link}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </section>
            ))}
          </div>
        </RevealRows>
      </div>
    </section>
  )
}
