import { ProjectList } from '@/components/sections/ProjectsSection'
import { BreadcrumbStructuredData, ProjectsStructuredData } from '@/components/seo/structured-data'
import { SectionHeading } from '@/components/ui/section-heading'
import { getProjects } from '@/lib/data/projects-data'
import { pageSeo } from '@/lib/seo'

export const metadata = pageSeo('/projects')

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container-premium section-padding">
      <SectionHeading as="h1" label="Work" title="Public projects">
        My public, non-fork repositories from GitHub, ordered by recent
        activity. Open any of them to inspect the source and history.
      </SectionHeading>

      <ProjectList projects={projects} />

      <BreadcrumbStructuredData name="Projects" path="/projects" />
      <ProjectsStructuredData projects={projects} />
    </div>
  )
}
