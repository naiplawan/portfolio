import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ADMIN_CONFIGURED } from '@/lib/admin/api'

export const metadata: Metadata = {
  title: 'Content admin',
  robots: { index: false, follow: false },
}

// Reads the session cookie and live content on every request
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!ADMIN_CONFIGURED) {
    if (process.env.NODE_ENV === 'production') notFound()
    return (
      <div className="container-premium section-padding">
        <p className="mono-tag">
          Set CONTENT_API_URL and ADMIN_PROXY_SECRET (shared with the Go content API in backend/) to use the admin.
        </p>
      </div>
    )
  }
  return <div className="container-premium section-padding">{children}</div>
}
