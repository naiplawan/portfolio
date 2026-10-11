'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container-premium section-padding">
      <p className="section-label mb-6 border-t border-foreground pt-3">Something went wrong</p>
      <h1 className="max-w-3xl font-display text-[clamp(2.5rem,7vw,5rem)] leading-none tracking-tight">
        This page hit an unexpected error.
      </h1>
      <p className="mt-8 max-w-lg text-lg text-muted-foreground">
        Try again — if it keeps happening, let me know what you were doing.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center rounded-lg bg-foreground px-5 text-background transition-opacity hover:opacity-85"
        >
          Try again
        </button>
        <Link href={ROUTES.HOME} className="ed-link">
          Go home
        </Link>
        <Link href={ROUTES.CONTACT} className="ed-link">
          Report the problem
        </Link>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <details className="mt-12 max-w-3xl">
          <summary className="section-label cursor-pointer">Error details (development)</summary>
          <pre className="mt-3 overflow-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
    </div>
  )
}
