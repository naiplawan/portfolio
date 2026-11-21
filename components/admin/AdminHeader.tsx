import Link from 'next/link'
import { logoutAction } from '@/app/admin/actions'

export function AdminHeader({ title, back }: { title: string; back?: boolean }) {
  return (
    <header className="mb-10 flex flex-wrap items-baseline justify-between gap-4 border-b border-[hsl(var(--rule))] pb-4">
      <div className="flex items-baseline gap-4">
        {back && (
          <Link href="/admin" className="ed-link font-mono text-xs">
            ← all content
          </Link>
        )}
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-5 text-sm">
        <Link href="/" className="ed-link">
          View site
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="ed-link">
            Sign out
          </button>
        </form>
      </div>
    </header>
  )
}
