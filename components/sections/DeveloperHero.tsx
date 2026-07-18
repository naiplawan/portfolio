'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DeveloperHero() {
  return (
    <section className="relative bg-background">
      <div className="container-premium flex min-h-[90vh] flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="section-label mb-6">
            Frontend Developer — Bangkok, TH
          </p>

          <h1 className="font-display text-balance text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] tracking-[-0.03em]">
            Rachaphol{' '}
            <span className="italic">Plookaom</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            I build fast, accessible web and mobile products with React,
            Next.js, TypeScript, Go, and Flutter—currently shipping at{' '}
            <span className="text-foreground">Unixdev Co., Ltd.</span>
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#projects"
              className="bio-button inline-flex items-center px-6 py-3 text-sm"
            >
              View selected work
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-[var(--radius)] border border-[hsl(var(--border))] px-6 py-3 text-sm transition-colors hover:border-foreground"
            >
              Start a conversation
            </Link>

            <div className="flex basis-full items-center justify-center gap-6 pt-2 text-sm text-muted-foreground sm:basis-auto sm:pt-0">
              <a
                href="https://github.com/naiplawan"
                target="_blank"
                rel="noreferrer"
                className="link-animated"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/rachaphol-plookaom"
                target="_blank"
                rel="noreferrer"
                className="link-animated"
              >
                LinkedIn
              </a>
              <a
                href="mailto:rachaphol.plo@gmail.com"
                className="link-animated"
              >
                Email
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 border-t border-[hsl(var(--rule))] pt-6"
        >
          <div className="mx-auto flex max-w-3xl items-center justify-center gap-8 font-mono text-xs text-muted-foreground sm:gap-12">
            <div>
              <span className="mr-2 text-foreground font-medium">Role</span>
              Frontend Developer
            </div>
            <div>
              <span className="mr-2 text-foreground font-medium">Stack</span>
              React · Go · Flutter
            </div>
            <div className="hidden sm:block">
              <span className="mr-2 text-foreground font-medium">Since</span>
              2023
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
