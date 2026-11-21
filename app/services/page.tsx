import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { BreadcrumbStructuredData } from '@/components/seo/structured-data';
import { ROUTES } from '@/lib/constants/routes';
import { SERVICES } from '@/lib/content';
import { pageSeo } from '@/lib/seo';

export const metadata = pageSeo('/services');

const services = SERVICES.offers.map(({ exampleName, exampleHref, ...service }) => ({
  ...service,
  example: { name: exampleName, href: exampleHref },
}));

const process = SERVICES.process.map((step, index) => ({ step: String(index + 1).padStart(2, '0'), ...step }));

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbStructuredData name="Services" path="/services" />
      <section className="container-premium pt-[clamp(4rem,10vw,8rem)]">
        <SectionHeading as="h1" label="Services" title="From a clear brief to a working product">
          Three ways I help businesses and product teams. Each starts with an
          agreed scope, deliverables and a timeline.
        </SectionHeading>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link href={ROUTES.CONTACT} className="inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-background transition-opacity hover:opacity-85 active:translate-y-px">
            Discuss your project <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href={ROUTES.BOOKING} className="ed-link">Book a call</Link>
        </div>
      </section>

      <section className="container-premium section-padding">
        <SectionHeading index="01" label="Offer" title="What I can help you ship" />
        <ol className="border-t border-[hsl(var(--rule))]">
          {services.map((service, index) => (
            <li key={service.title} className="grid gap-6 border-b border-[hsl(var(--rule))] py-10 md:grid-cols-[1fr_2fr] md:gap-12">
              <div>
                <span className="pixel-label text-[hsl(var(--accent))]">0{index + 1}</span>
                <h3 className="mt-3 font-display text-3xl tracking-tight">{service.title}</h3>
              </div>
              <div>
                <dl className="space-y-5 leading-relaxed">
                  <div><dt className="mono-tag mb-1">For</dt><dd className="text-muted-foreground">{service.suitableFor}</dd></div>
                  <div><dt className="mono-tag mb-1">You receive</dt><dd>{service.deliverable}</dd></div>
                </dl>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {service.features.map((feature) => <li key={feature} className="flex gap-3"><span aria-hidden="true">–</span><span>{feature}</span></li>)}
                </ul>
                <p className="mt-6 text-sm leading-relaxed"><span className="mono-tag mr-2">Example</span><Link href={service.example.href} className="ed-link">{service.example.name}</Link></p>
                <Link href={ROUTES.CONTACT + '?subject=' + encodeURIComponent('Enquiry: ' + service.title)} className="ed-link mt-6 inline-flex items-center gap-1 text-sm">
                  Discuss {service.title.toLowerCase()} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-premium pb-[clamp(4rem,10vw,8rem)]">
        <SectionHeading index="02" label="Process" title="How a project runs">
          Pricing, delivery dates and any ongoing support are agreed in the proposal.
        </SectionHeading>
        <ol className="grid border-t border-[hsl(var(--rule))] sm:grid-cols-2 lg:grid-cols-4">
          {process.map((item) => (
            <li key={item.step} className="border-b border-[hsl(var(--rule))] py-6 sm:pr-8 lg:border-b-0">
              <span className="font-pixel text-3xl text-[hsl(var(--accent))]">{item.step}</span>
              <h3 className="mt-3 font-medium">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
