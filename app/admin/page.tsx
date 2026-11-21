import Link from 'next/link'
import { newProjectAction } from './actions'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { SlugForm } from '@/components/admin/forms'
import { getBundle } from '@/lib/admin/api'
import { requireSession } from '@/lib/admin/session'
import { CONTENT_DOCUMENTS } from '@/lib/content/schemas'

const DOCUMENT_LABELS: Record<keyof typeof CONTENT_DOCUMENTS, string> = {
  site: 'Site & contact',
  seo: 'SEO titles, descriptions and keywords',
  faq: 'FAQ',
  home: 'Home page: hero, capabilities, about',
  about: 'About page',
  timeline: 'Career timeline',
  services: 'Services page',
  booking: 'Booking page',
  'project-overrides': 'GitHub corrections',
}

export default async function AdminPage() {
  await requireSession()
  const { projects } = await getBundle()

  return (
    <>
      <AdminHeader title="Content admin" />
      <p className="mb-10 max-w-2xl text-sm text-muted-foreground">
        Each save is validated, stored in Postgres and published by a site rebuild a minute or two later.
      </p>

      <section className="mb-14">
        <h2 className="section-label mb-4">Pages and settings</h2>
        <ul className="border-t border-[hsl(var(--rule))]">
          {Object.entries(DOCUMENT_LABELS).map(([name, label]) => (
            <li key={name} className="border-b border-[hsl(var(--rule))]">
              <Link href={`/admin/content/${name}`} className="flex justify-between gap-4 py-4 hover:text-[hsl(var(--accent))]">
                <span>{label}</span>
                <span className="font-mono text-xs text-muted-foreground">{name}.json</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="section-label mb-4">Curated projects</h2>
        <ul className="mb-8 border-t border-[hsl(var(--rule))]">
          {projects.map(({ slug, data }) => (
            <li key={slug} className="border-b border-[hsl(var(--rule))]">
              <Link href={`/admin/projects/${slug}`} className="flex justify-between gap-4 py-4 hover:text-[hsl(var(--accent))]">
                <span>{(data as { title?: string }).title ?? slug}</span>
                <span className="font-mono text-xs text-muted-foreground">{slug}</span>
              </Link>
            </li>
          ))}
        </ul>
        <SlugForm action={newProjectAction} />
      </section>
    </>
  )
}
