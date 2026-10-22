import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { RevealRows } from '@/components/motion/RevealRows'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { ICONS, type IconName } from '@/components/pixel/sprites'
import { SectionHeading } from '@/components/ui/section-heading'
import { SOCIAL_LINKS } from '@/lib/constants'
import { FEATURED_PROJECTS } from '@/lib/data/featured-projects'
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

  return (
    <li className="group grid grid-cols-[2.75rem_1fr] gap-x-4 border-b border-[hsl(var(--rule))] py-8 sm:grid-cols-[4.5rem_1fr_auto] sm:gap-x-8 sm:py-10">
      <div className="flex flex-col items-start gap-3 pt-1">
        <span className="pixel-border inline-flex p-1.5 text-[hsl(var(--rule))] transition-[color,transform] duration-200 [transition-timing-function:steps(2)] group-hover:-translate-y-1 group-hover:text-[hsl(var(--accent))]">
          <PixelSprite sprite={ICONS[CATEGORY_ICON[project.category]]} className="h-6 w-6 group-hover:animate-pixel-wiggle sm:h-8 sm:w-8" />
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
          {project.businessImpact && (
            <>
              <dt className="mono-tag pt-0.5">result</dt>
              <dd className="leading-relaxed text-foreground">{project.businessImpact.businessOutcome}</dd>
            </>
          )}
          <dt className="mono-tag pt-0.5">links</dt>
          <dd className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="font-mono text-xs text-muted-foreground">{STATUS_RESULT[project.status]}</span>
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
    <RevealRows rows="li">
      <ol className="border-t border-[hsl(var(--rule))]">
        {projects.map((project, index) => (
          <ProjectRow key={project.id} project={project} index={index} />
        ))}
      </ol>
    </RevealRows>
  )
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-padding scroll-mt-20">
      <div className="container-premium">
        <SectionHeading index="01" label="Selected work" title="Three problems, three working products">
          A closer look at what I built, the decisions behind it and what each
          project makes possible.
        </SectionHeading>

        <ol className="border-t border-[hsl(var(--rule))]">
          {FEATURED_PROJECTS.map((project, index) => (
            <li key={project.slug} id={`project-${project.slug}`} className="scroll-mt-20 border-b border-[hsl(var(--rule))] py-10 sm:py-12">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="pixel-label text-[hsl(var(--accent))]">exp-{String(index + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-3xl tracking-tight sm:text-4xl">{project.title}</h3>
              </div>
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <div>
                  <figure>
                    <a href={project.image} target="_blank" rel="noopener noreferrer" aria-label={`View full screenshot of ${project.title}`} className="block">
                      <Image
                        src={project.image}
                        alt={project.screenshot.alt}
                        width={project.screenshot.width}
                        height={project.screenshot.height}
                        sizes="(min-width: 1024px) 528px, (min-width: 640px) 90vw, 100vw"
                        className="aspect-[16/10] w-full border border-[hsl(var(--rule))] object-cover object-top"
                      />
                    </a>
                    <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {project.screenshot.caption}{' '}
                      <a href={project.image} target="_blank" rel="noopener noreferrer" className="ed-link">View full size<span className="sr-only"> screenshot of {project.title}</span></a>
                    </figcaption>
                  </figure>
                  <p className="mt-5 font-mono text-xs leading-relaxed text-muted-foreground">{project.technologies.join(' · ')}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="ed-link inline-flex items-center gap-1">Live site <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>}
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="ed-link inline-flex items-center gap-1">Source &amp; project notes <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
                  </div>
                </div>
                <dl className="space-y-5 text-sm leading-relaxed">
                  {[
                    ['hypothesis', project.problemStatement],
                    ['my contribution', project.contribution],
                    ['key decision', project.designDecision],
                    ['result', project.businessImpact.businessOutcome],
                  ].map(([label, detail]) => (
                    <div key={label}>
                      <dt className="mono-tag mb-1 text-[hsl(var(--accent))]">{label}</dt>
                      <dd className={label === 'result' ? 'text-foreground' : 'text-muted-foreground'}>{detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </li>
          ))}
        </ol>

        <Link href="/projects" className="ed-link mt-10 inline-flex items-center gap-1 text-sm">
          Browse all projects
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
