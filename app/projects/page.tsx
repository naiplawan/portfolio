import { ProjectList } from '@/components/sections/ProjectsSection'
import { SectionHeading } from '@/components/ui/section-heading'
import { getProjects } from '@/lib/data/projects-data'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container-premium section-padding">
      <SectionHeading as="h1" label="Work" title="Public projects">
        My public, non-fork repositories from GitHub, ordered by recent
        activity. Open any of them to inspect the source and history.
      </SectionHeading>

      <ProjectList projects={projects} />
    </div>
  )
}
