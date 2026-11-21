/**
 * Server-side client for the Go content API (backend/). Only server
 * components and server actions import this module; the token never reaches
 * the browser except as an httpOnly cookie.
 */

export const CONTENT_API_URL = process.env.CONTENT_API_URL?.replace(/\/+$/, '')

export class ContentApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
  }
}

async function request(path: string, init: RequestInit & { token?: string } = {}): Promise<Response> {
  if (!CONTENT_API_URL) throw new ContentApiError('CONTENT_API_URL is not set', 503)
  const { token, headers, ...rest } = init
  const response = await fetch(`${CONTENT_API_URL}${path}`, {
    ...rest,
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null
    throw new ContentApiError(body?.error ?? `Content API returned ${response.status}`, response.status)
  }
  return response
}

export interface ContentBundle {
  documents: Record<string, unknown>
  projects: { slug: string; data: unknown }[]
}

export async function getBundle(): Promise<ContentBundle> {
  return (await request('/api/content')).json()
}

export async function login(password: string): Promise<{ token: string; expiresAt: string }> {
  return (await request('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) })).json()
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await request('/api/admin/session', { token })
    return true
  } catch (error) {
    if (error instanceof ContentApiError && error.status === 401) return false
    throw error
  }
}

export async function putDocument(token: string, name: string, data: unknown): Promise<void> {
  await request(`/api/admin/content/${encodeURIComponent(name)}`, { method: 'PUT', token, body: JSON.stringify(data, null, 2) })
}

export async function putProject(token: string, slug: string, data: unknown): Promise<void> {
  await request(`/api/admin/projects/${encodeURIComponent(slug)}`, { method: 'PUT', token, body: JSON.stringify(data, null, 2) })
}

export async function deleteProject(token: string, slug: string): Promise<void> {
  await request(`/api/admin/projects/${encodeURIComponent(slug)}`, { method: 'DELETE', token })
}
