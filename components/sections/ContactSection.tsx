'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const contactMethods = [
  {
    label: 'Email',
    value: 'rachaphol.plo@gmail.com',
    href: 'mailto:rachaphol.plo@gmail.com',
    icon: Mail,
  },
  {
    label: 'Phone',
    value: '+66 91 069 6072',
    href: 'tel:+66910696072',
    icon: Phone,
  },
] as const

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      ref={ref}
      id="contact"
      className="section-padding border-t border-[hsl(var(--rule))]"
    >
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16"
        >
          <div>
            <p className="section-label mb-3">Contact</p>
            <h2 className="max-w-xl font-display text-4xl tracking-tight sm:text-5xl">
              Have a product idea or a frontend challenge?
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Tell me what you are building, who it is for, and where you need
              help. The contact page sends your message directly to me.
            </p>
            <Link
              href="/contact"
              className="bio-button mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              Start a conversation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {contactMethods.map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="group flex items-center gap-4 rounded-[var(--radius)] border border-[hsl(var(--border))] p-4 transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground">{label}</span>
                  <span className="block truncate text-sm font-medium">{value}</span>
                </span>
                <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ))}

            <div className="flex items-center gap-4 rounded-[var(--radius)] border border-[hsl(var(--border))] p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <MapPin className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-xs text-muted-foreground">Location</span>
                <span className="block text-sm font-medium">Bangkok, Thailand</span>
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href="https://github.com/naiplawan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border))] transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <FaGithub className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/rachaphol-plookaom"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border))] transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <FaLinkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
