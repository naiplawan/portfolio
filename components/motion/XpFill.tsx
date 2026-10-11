'use client'

import { useRef } from 'react'
import { MOTION_OK, gsap, useGSAP } from './gsap'

/**
 * Fills every `.xp-on` segment inside it block by block when scrolled into view.
 * Segments are server-rendered filled, so the levels read correctly without motion.
 */
export function XpFill({ children, className }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        gsap.from(gsap.utils.toArray<HTMLElement>('.xp-on', root.current), {
          autoAlpha: 0,
          duration: 0.05,
          ease: 'none',
          stagger: { each: 0.025, from: 'start' },
          scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
        })
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  )
}
