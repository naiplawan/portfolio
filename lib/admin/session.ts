import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySession } from './api'

const COOKIE = 'portfolio_admin'

export async function setSessionCookie(token: string, expiresAt: string) {
  ;(await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    expires: new Date(expiresAt),
  })
}

export async function clearSessionCookie() {
  ;(await cookies()).delete({ name: COOKIE, path: '/admin' })
}

/** The session token, verified with the content API; otherwise redirects to the login page. */
export async function requireSession(): Promise<string> {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token || !(await verifySession(token))) redirect('/admin/login')
  return token
}
