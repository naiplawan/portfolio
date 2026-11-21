'use client'

import { usePathname } from 'next/navigation'

interface SiteChromeProps {
  /** Rendered before `<main>` on public pages (skip link, nav, analytics) */
  header: React.ReactNode
  /** Rendered after `<main>` on public pages (footer, easter eggs) */
  footer: React.ReactNode
  children: React.ReactNode
}

/** Public pages get the site frame; the content admin renders alone. */
export function SiteChrome({ header, footer, children }: SiteChromeProps) {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) return <>{children}</>

  return (
    <>
      {header}
      <main id="main-content" tabIndex={-1} className="focus:outline-none min-h-screen pt-14">
        {children}
      </main>
      {footer}
    </>
  )
}
