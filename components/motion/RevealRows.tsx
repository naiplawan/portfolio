'use client'

import { useRef } from 'react'
import { MOTION_OK, ScrollTrigger, gsap, stepped, useGSAP } from './gsap'

interface RevealRowsProps {
  children: React.ReactNode
  /** Rows inside `children` to reveal, e.g. `li` */
  rows: string
  className?: string
}

/**
 * Wipes each row open top-to-bottom in pixel steps, like a CRT scanline, as it
 * scrolls into view. Rows are server-rendered visible; they are only clipped once
 * GSAP runs, and rows already on screen reveal immediately.
 */
export function RevealRows({ children, rows, className }: RevealRowsProps) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const targets = gsap.utils.toArray<HTMLElement>(rows, root.current)
        gsap.set(targets, { clipPath: 'inset(0 0 100% 0)' })

        const triggers = ScrollTrigger.batch(targets, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              clipPath: 'inset(0 0 0% 0)',
              duration: 0.42,
              ease: stepped(6),
              stagger: 0.09,
              clearProps: 'clipPath',
            }),
        })

        return () => triggers.forEach((trigger) => trigger.kill())
      })

      return () => mm.revert()
    },
    { scope: root, dependencies: [rows] }
  )

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  )
}
