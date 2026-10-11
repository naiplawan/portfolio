'use client'

import { useRef } from 'react'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { CELL, DAUGHTER_CELL } from '@/components/pixel/sprites'
import { MOTION_OK, gsap, stepped, useGSAP } from './gsap'

/** Cells parked in the page margins, as viewport percentages. */
const CELLS = [
  { side: 'left', top: 18, size: 33, sprite: DAUGHTER_CELL },
  { side: 'left', top: 52, size: 45, sprite: CELL },
  { side: 'left', top: 82, size: 27, sprite: DAUGHTER_CELL },
  { side: 'right', top: 30, size: 27, sprite: DAUGHTER_CELL },
  { side: 'right', top: 64, size: 45, sprite: CELL },
] as const

/**
 * Ambient biology for wide screens: a few cells drift slowly in the side margins
 * and now and then pulse as if about to divide. Decorative and behind content.
 */
export function AmbientCells() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('.ambient-cell', root.current).forEach((cell, i) => {
          gsap.to(cell, {
            y: gsap.utils.random(-28, 28, 4),
            x: gsap.utils.random(-12, 12, 4),
            duration: gsap.utils.random(7, 11),
            ease: stepped(10),
            yoyo: true,
            repeat: -1,
            delay: i * 0.8,
          })
          // Every so often: a quick "about to divide" pulse
          gsap
            .timeline({ repeat: -1, repeatDelay: gsap.utils.random(8, 14), delay: 4 + i * 2.5 })
            .to(cell.querySelector('svg'), { scale: 1.15, duration: 0.3, ease: stepped(2), yoyo: true, repeat: 3 })
        })
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <div
      ref={root}
      className="pointer-events-none fixed inset-0 z-0 hidden min-[1360px]:block"
      aria-hidden="true"
    >
      {CELLS.map(({ side, top, size, sprite }, i) => (
        <div
          key={i}
          className="ambient-cell absolute opacity-40"
          style={{ top: `${top}%`, [side]: '2.5vw', width: size, height: size }}
        >
          <PixelSprite sprite={sprite} className="pixelated h-full w-full" />
        </div>
      ))}
    </div>
  )
}
