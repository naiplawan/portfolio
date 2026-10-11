import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { SOCIAL_LINKS } from '@/lib/constants'
import type { Project } from '@/lib/types/types'

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const primaryUrl = project.liveUrl ?? project.githubUrl
  const stars = project.metrics?.performance

  return (
    <li className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-[hsl(var(--rule))] py-8 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-x-8 sm:py-10">
      <span className="index-num pt-2">{String(index + 1).padStart(2, '0')}</span>

      <div className="min-w-0">
        <h3 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight tracking-tight">
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[hsl(var(--accent))]"
          >
            {project.title}
            <ArrowUpRight
              className="ml-2 inline-block h-5 w-5 align-middle text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </h3>

        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {project.technologies.length > 0 && (
            <span className="mono-tag">{project.technologies.slice(0, 4).join(' · ')}</span>
          )}
          {stars && <span className="mono-tag">{stars}</span>}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-link"
          >
            Source
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ed-link"
            >
              Live site
            </a>
          )}
        </div>
      </div>

      <span className="mono-tag col-start-2 mt-4 sm:col-start-3 sm:mt-0 sm:pt-3">
        {project.completedYear}
      </span>
    </li>
  )
}

export function ProjectList({ projects }: { projects: readonly Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="border-y border-[hsl(var(--rule))] py-10 text-muted-foreground">
        Projects are temporarily unavailable. Browse them on{' '}
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="ed-link text-foreground"
        >
          GitHub
        </a>
        .
      </p>
    )
  }

  return (
    <ol className="border-t border-[hsl(var(--rule))]">
      {projects.map((project, index) => (
        <ProjectRow key={project.id} project={project} index={index} />
      ))}
    </ol>
  )
}

export default function ProjectsSection({
  projects,
}: {
  projects: readonly Project[]
}) {
  return (
    <section id="projects" className="section-padding scroll-mt-20">
      <div className="container-premium">
        <SectionHeading index="01" label="Selected work" title="Things I've built recently">
          Public repositories from my GitHub, ordered by recent activity.
        </SectionHeading>

        <ProjectList projects={projects.slice(0, 5)} />

        {projects.length > 5 && (
          <Link
            href="/projects"
            className="ed-link mt-10 inline-flex items-center gap-1 text-sm"
          >
            All {projects.length} projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </section>
  )
}
