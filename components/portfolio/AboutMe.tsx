'use client'

import { motion } from 'framer-motion'
import { Code2, Database, Smartphone } from 'lucide-react'

const capabilities = [
  {
    icon: Code2,
    title: 'Frontend',
    description:
      'Accessible, responsive interfaces with React, Next.js, TypeScript, and Tailwind CSS.',
  },
  {
    icon: Database,
    title: 'Backend',
    description:
      'Practical APIs and data layers with Go, Node.js, PostgreSQL, and MongoDB.',
  },
  {
    icon: Smartphone,
    title: 'Mobile',
    description:
      'Cross-platform product development with Flutter and Dart.',
  },
] as const

export default function AboutMe() {
  return (
    <section className="section-padding bg-background">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20"
        >
          <div>
            <p className="section-label mb-3">About</p>
            <h1 className="font-display text-5xl tracking-tight sm:text-6xl">
              Product-minded frontend development
            </h1>
          </div>

          <div>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                I’m Rachaphol, a Frontend Developer at Unixdev Co., Ltd. in
                Bangkok. I turn product requirements and interface designs into
                clear, maintainable web experiences.
              </p>
              <p>
                My strongest tools are React, Next.js, and TypeScript. I also
                work across Go backends and Flutter apps when a product needs
                continuity beyond the browser.
              </p>
              <p>
                I care about accessibility, performance, and the small
                interaction details that make software feel dependable.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {capabilities.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-[var(--radius)] border border-[hsl(var(--border))] p-5"
                >
                  <Icon className="mb-5 h-5 w-5" />
                  <h2 className="font-medium">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
