import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/constants'

const channels = [
  { label: 'Phone', value: '+66 91 069 6072', href: 'tel:+66910696072', external: false },
  { label: 'GitHub', value: 'naiplawan', href: SOCIAL_LINKS.github, external: true },
  { label: 'LinkedIn', value: 'rachaphol-plookaom', href: SOCIAL_LINKS.linkedin, external: true },
]

export default function ContactSection({ index }: { index?: string }) {
  return (
    <section id="contact" className="section-padding scroll-mt-20 bg-foreground text-background">
      <div className="container-premium">
        <div className="mb-10 flex items-baseline gap-4 border-t border-background pt-3">
          {index && <span className="index-num text-background">{index}</span>}
          <span className="section-label text-background/70">Contact</span>
        </div>

        <h2 className="max-w-4xl text-balance font-display text-[clamp(2.5rem,7vw,5rem)] leading-[1] tracking-tight">
          Have a product idea or a frontend problem? Let&apos;s talk.
        </h2>

        <a
          href={`mailto:${SOCIAL_LINKS.email}`}
          className="mt-10 inline-block break-all font-display text-[clamp(1.5rem,5vw,3rem)] italic underline decoration-1 underline-offset-[0.2em] transition-colors hover:text-[hsl(var(--accent))]"
        >
          {SOCIAL_LINKS.email}
        </a>

        <div className="mt-14 grid gap-10 border-t border-background/20 pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <dl className="grid gap-4 sm:grid-cols-3 sm:gap-8">
            {channels.map(({ label, value, href, external }) => (
              <div key={label}>
                <dt className="font-mono text-xs uppercase tracking-widest text-background/60">{label}</dt>
                <dd className="mt-1">
                  <a
                    href={href}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="underline decoration-background/30 decoration-1 underline-offset-4 transition-colors hover:decoration-background"
                  >
                    {value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href="/contact"
            className="inline-flex h-11 items-center gap-2 self-start rounded-lg bg-background px-5 text-sm text-foreground transition-opacity hover:opacity-85"
          >
            Send a message
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
