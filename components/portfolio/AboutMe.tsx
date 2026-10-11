import { SectionHeading } from '@/components/ui/section-heading'

const capabilities = [
  {
    title: 'Frontend',
    description:
      'Accessible, responsive interfaces with React, Next.js, TypeScript, and Tailwind CSS.',
  },
  {
    title: 'Backend',
    description:
      'Practical APIs and data layers with Go, Node.js, PostgreSQL, and MongoDB.',
  },
  {
    title: 'Mobile',
    description: 'Cross-platform product development with Flutter and Dart.',
  },
] as const

export default function AboutMe() {
  return (
    <section className="section-padding">
      <div className="container-premium">
        <SectionHeading as="h1" label="About" title="Product-minded frontend development" />

        <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-20">
          <div className="space-y-6 text-xl leading-relaxed">
            <p>
              I’m Rachaphol, a Frontend Developer at Unixdev Co., Ltd. in
              Bangkok. I turn product requirements and interface designs into
              clear, maintainable web experiences.
            </p>
            <p className="text-muted-foreground">
              My strongest tools are React, Next.js, and TypeScript. I also
              work across Go backends and Flutter apps when a product needs
              continuity beyond the browser.
            </p>
            <p className="text-muted-foreground">
              I care about accessibility, performance, and the small
              interaction details that make software feel dependable.
            </p>
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
