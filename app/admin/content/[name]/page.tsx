import { notFound } from 'next/navigation'
import { saveDocumentAction } from '../../actions'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { JsonEditor } from '@/components/admin/AdminForms'
import { getBundle } from '@/lib/admin/api'
import { requireSession } from '@/lib/admin/session'
import { CONTENT_DOCUMENTS } from '@/lib/content/schemas'

export default async function AdminDocumentPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  if (!Object.hasOwn(CONTENT_DOCUMENTS, name)) notFound()
  await requireSession()
  const { documents } = await getBundle()
  if (!Object.hasOwn(documents, name)) notFound()

  return (
    <>
      <AdminHeader title={`${name}.json`} back />
      <JsonEditor
        action={saveDocumentAction.bind(null, name)}
        initialJson={JSON.stringify(documents[name], null, 2)}
        label="Content (JSON). Saving checks it against the site's schema. Text in home, about and faq can use {name}, {jobTitle}, {company}, {location} and {email} from Site & contact."
      />
    </>
  )
}
