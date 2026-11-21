import { notFound } from 'next/navigation'
import { deleteProjectAction, saveProjectAction } from '../../actions'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { DeleteForm, JsonEditor } from '@/components/admin/AdminForms'
import { getBundle } from '@/lib/admin/api'
import { requireSession } from '@/lib/admin/session'

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** Starting point for a new project; it fails validation until the fields are filled in. */
function template(slug: string, order: number) {
  return {
    title: '',
    order,
    notes: '',
    githubRepoId: 0,
    githubUrl: `https://github.com/naiplawan/${slug}`,
    liveUrl: null,
    description: '',
    problemStatement: '',
    solution: '',
    image: `/assets/projects/${slug}/image.png`,
    technologies: [],
    highlights: [],
    category: 'web',
    status: 'live',
    completedYear: new Date().getFullYear(),
    caseStudy: { discriminant: false },
  }
}

export default async function AdminProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUG.test(slug)) notFound()
  await requireSession()
  const { projects } = await getBundle()
  const existing = projects.find((project) => project.slug === slug)
  const nextOrder = projects.length + 1

  return (
    <>
      <AdminHeader title={existing ? `Project: ${slug}` : `New project: ${slug}`} back />
      {!existing && (
        <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
          Add the screenshot to <code className="font-mono">public/assets/projects/{slug}/</code> in the repository before
          saving; the site build refuses projects whose screenshot is missing.
        </p>
      )}
      <JsonEditor
        action={saveProjectAction.bind(null, slug)}
        initialJson={JSON.stringify(existing?.data ?? template(slug, nextOrder), null, 2)}
        label="Project (JSON). Set caseStudy.discriminant to true and fill caseStudy.value to show it on the home page."
      />
      {existing && (
        <div className="mt-16 border-t border-[hsl(var(--rule))] pt-6">
          <DeleteForm action={deleteProjectAction.bind(null, slug)} slug={slug} />
        </div>
      )}
    </>
  )
}
