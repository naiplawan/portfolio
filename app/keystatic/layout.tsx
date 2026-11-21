import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content admin',
  robots: { index: false, follow: false },
}

export default function KeystaticLayout({ children }: { children: React.ReactNode }) {
  return children
}
