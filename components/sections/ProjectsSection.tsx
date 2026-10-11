import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { ICONS, type IconName } from '@/components/pixel/sprites'
import { SectionHeading } from '@/components/ui/section-heading'
import { SOCIAL_LINKS } from '@/lib/constants'
import type { Project } from '@/lib/types/types'

const CATEGORY_ICON: Record<Project['category'], IconName> = {
  web: 'globe',
  mobile: 'phone',
  backend: 'server',
  fullstack: 'server',
  enterprise: 'server',
  ai: 'chip',
  gaming: 'gamepad',
  tools: 'flask',
  wellness: 'flask',
  other: 'flask',
}

const STATUS_RESULT: Record<Project['status'], string> = {
  live: 'Active',
  development: 'In progress',
  archived: 'Archived',
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const primaryUrl = project.liveUrl ?? project.githubUrl
  const stars = project.metrics?.performance
  const result = [STATUS_RESULT[project.status], stars, project.liveUrl && 'deployed']
    .filter(Boolean)
    .join(' · ')

  return (
    <li className="group grid grid-cols-[2.75rem_1fr] gap-x-4 border-b border-[hsl(var(--rule))] py-8 sm:grid-cols-[4.5rem_1fr_auto] sm:gap-x-8 sm:py-10">
      <div className="flex flex-col items-start gap-3 pt-1">
        <span className="pixel-border inline-flex p-1.5 text-[hsl(var(--rule))] transition-[color,transform] duration-200 [transition-timing-function:steps(2)] group-hover:-translate-y-1 group-hover:text-[hsl(var(--accent))]">
          <PixelSprite sprite={ICONS[CATEGORY_ICON[project.category]]} className="h-6 w-6 sm:h-8 sm:w-8" />
        </span>
        <span className="pixel-label text-muted-foreground">exp-{String(index + 1).padStart(2, '0')}</span>
      </div>

      <div className="min-w-0">
        <h3 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold leading-tight tracking-tight">
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

        <dl className="mt-4 grid max-w-2xl gap-x-5 gap-y-2 text-sm sm:grid-cols-[6.5rem_1fr]">
          <dt className="mono-tag pt-0.5">hypothesis</dt>
          <dd className="leading-relaxed text-muted-foreground">{project.description}</dd>
          {project.technologies.length > 0 && (
            <>
              <dt className="mono-tag pt-0.5">method</dt>
              <dd className="font-mono text-xs leading-relaxed text-foreground sm:pt-0.5">
                {project.technologies.slice(0, 5).join(' · ')}
              </dd>
            </>
          )}
          <dt className="mono-tag pt-0.5">result</dt>
          <dd className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="font-mono text-xs text-foreground">{result}</span>
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
          </dd>
        </dl>
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
        <SectionHeading index="01" label="Selected work" title="Lab notebook: recent experiments">
          Public repositories from my GitHub, ordered by recent activity. Each one
          started as a hypothesis about what someone needed.
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
