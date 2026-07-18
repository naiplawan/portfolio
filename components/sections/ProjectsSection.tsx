'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import type { Project } from '@/lib/types/types'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        delay: Math.min(index * 0.06, 0.24),
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group overflow-hidden rounded-[var(--radius)] border border-[hsl(var(--border))] bg-card"
    >
      <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-muted to-background">
        <FaGithub className="h-16 w-16 text-foreground/80 transition-transform duration-500 motion-safe:group-hover:scale-105" />
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((technology) => (
            <span
              key={technology}
              className="rounded-full border border-[hsl(var(--border))] bg-background/80 px-2.5 py-1 font-mono text-[10px] text-foreground backdrop-blur-sm"
            >
              {technology}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              GitHub · {project.completedYear}
            </p>
            <h3 className="font-display text-2xl tracking-tight">
              {project.title}
            </h3>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>

        <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-[hsl(var(--rule))] pt-4">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[hsl(var(--accent))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FaGithub className="h-4 w-4" />
            Source
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  )
}

export default function ProjectsSection({
  projects,
}: {
  projects: readonly Project[]
}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const displayedProjects = projects.slice(0, 6)

  return (
    <section
      ref={ref}
      id="projects"
      className="section-padding scroll-mt-20 border-t border-[hsl(var(--rule))]"
    >
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-12"
        >
          <p className="section-label mb-3">Selected Work</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                Recent GitHub projects
              </h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Public repositories pulled directly from my GitHub profile,
                ordered by recent activity.
              </p>
            </div>
            <Link href="/projects" className="link-animated text-sm text-muted-foreground">
              View all projects
            </Link>
          </div>
        </motion.div>

        {displayedProjects.length > 0 ? (
          <ProjectGrid projects={displayedProjects} />
        ) : (
          <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] p-8 text-center text-sm text-muted-foreground">
            Projects are temporarily unavailable. Visit{' '}
            <a
              href="https://github.com/naiplawan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </div>
        )}
      </div>
    </section>
  )
}
