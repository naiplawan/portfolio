import { notFound } from 'next/navigation'
import { saveDocumentAction } from '../../actions'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { JsonEditor } from '@/components/admin/forms'
import { getBundle } from '@/lib/admin/api'
import { requireSession } from '@/lib/admin/session'
import { CONTENT_DOCUMENTS } from '@/lib/content/schemas'

export default async function AdminDocumentPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  if (!(name in CONTENT_DOCUMENTS)) notFound()
  await requireSession()
  const { documents } = await getBundle()
  if (!(name in documents)) notFound()

  return (
    <>
      <AdminHeader title={`${name}.json`} back />
      <JsonEditor
        action={saveDocumentAction.bind(null, name)}
        initialJson={JSON.stringify(documents[name], null, 2)}
        label="Content (JSON). Saving checks it against the site's schema."
      />
    </>
  )
}
