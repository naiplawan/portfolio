'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { ContentApiError, deleteProject, login, putDocument, putProject } from '@/lib/admin/api'
import { clearSessionCookie, requireSession, setSessionCookie } from '@/lib/admin/session'
import { CONTENT_DOCUMENTS, projectSchema, type ContentDocumentName } from '@/lib/content/schemas'

export interface ActionState {
  ok: boolean
  message: string
}

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const PUBLISH_NOTE = 'Saved. The site rebuilds automatically in a minute or two.'

export async function loginAction(_previous: ActionState, form: FormData): Promise<ActionState> {
  const password = String(form.get('password') ?? '')
  if (!password) return { ok: false, message: 'Enter the password.' }
  try {
    const { token, expiresAt } = await login(password)
    await setSessionCookie(token, expiresAt)
  } catch (error) {
    return { ok: false, message: error instanceof ContentApiError ? error.message : 'The content API is unreachable.' }
  }
  redirect('/admin')
}

export async function logoutAction() {
  await clearSessionCookie()
  redirect('/admin/login')
}

/** Parses the editor's JSON and checks it with the same zod schema the site build uses. */
function parse(schema: z.ZodType, raw: FormDataEntryValue | null): { data: unknown } | { error: string } {
  let data: unknown
  try {
    data = JSON.parse(String(raw ?? ''))
  } catch (error) {
    return { error: `Not valid JSON: ${(error as Error).message}` }
  }
  const result = schema.safeParse(data)
  return result.success ? { data } : { error: z.prettifyError(result.error) }
}

async function save(write: () => Promise<void>): Promise<ActionState> {
  try {
    await write()
    return { ok: true, message: PUBLISH_NOTE }
  } catch (error) {
    if (error instanceof ContentApiError && error.status === 401) redirect('/admin/login')
    return { ok: false, message: error instanceof Error ? error.message : 'Saving failed.' }
  }
}

export async function saveDocumentAction(name: string, _previous: ActionState, form: FormData): Promise<ActionState> {
  const token = await requireSession()
  if (!(name in CONTENT_DOCUMENTS)) return { ok: false, message: 'Unknown document.' }
  const parsed = parse(CONTENT_DOCUMENTS[name as ContentDocumentName], form.get('json'))
  if ('error' in parsed) return { ok: false, message: parsed.error }
  return save(() => putDocument(token, name, parsed.data))
}

export async function saveProjectAction(slug: string, _previous: ActionState, form: FormData): Promise<ActionState> {
  const token = await requireSession()
  if (!SLUG.test(slug)) return { ok: false, message: 'Invalid slug.' }
  const parsed = parse(projectSchema, form.get('json'))
  if ('error' in parsed) return { ok: false, message: parsed.error }
  return save(() => putProject(token, slug, parsed.data))
}

export async function deleteProjectAction(slug: string, _previous: ActionState, form: FormData): Promise<ActionState> {
  const token = await requireSession()
  if (form.get('confirm') !== slug) return { ok: false, message: `Type “${slug}” to confirm.` }
  const result = await save(() => deleteProject(token, slug))
  if (result.ok) redirect('/admin')
  return result
}

export async function newProjectAction(_previous: ActionState, form: FormData): Promise<ActionState> {
  await requireSession()
  const slug = String(form.get('slug') ?? '').trim()
  if (!SLUG.test(slug)) return { ok: false, message: 'Use lowercase letters, numbers and single hyphens, e.g. my-project.' }
  redirect(`/admin/projects/${slug}`)
}
