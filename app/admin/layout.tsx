import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CONTENT_API_URL } from '@/lib/admin/api'

export const metadata: Metadata = {
  title: 'Content admin',
  robots: { index: false, follow: false },
}

// Reads the session cookie and live content on every request
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!CONTENT_API_URL) {
    if (process.env.NODE_ENV === 'production') notFound()
    return (
      <div className="container-premium section-padding">
        <p className="mono-tag">Set CONTENT_API_URL (the Go content API in backend/) to use the admin.</p>
      </div>
    )
  }
  return <div className="container-premium py-10 sm:py-14">{children}</div>
}
