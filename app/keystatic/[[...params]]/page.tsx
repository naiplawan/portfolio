import { notFound } from 'next/navigation'
import { KEYSTATIC_ENABLED } from '@/lib/content/admin'
import KeystaticApp from '../keystatic'

export default function KeystaticPage() {
  if (!KEYSTATIC_ENABLED) notFound()
  return <KeystaticApp />
}
