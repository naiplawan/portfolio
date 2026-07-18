import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProjectGrid } from '@/components/sections/ProjectsSection'
import { getProjects } from '@/lib/data/projects-data'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen pt-20">
      <div className="container-premium section-padding">
        <Link
          href="/#projects"
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </Link>

        <header className="mb-12 max-w-3xl">
          <p className="section-label mb-3">GitHub</p>
          <h1 className="font-display text-5xl tracking-tight sm:text-7xl">
            Public projects
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            My public, non-fork repositories from GitHub, ordered by recent
            activity. Open any repository to inspect the source and history.
          </p>
        </header>

        {projects.length > 0 ? (
          <ProjectGrid projects={projects} />
        ) : (
          <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] p-8 text-center text-muted-foreground">
            GitHub projects are temporarily unavailable.
          </div>
        )}
      </div>
    </div>
  )
}
