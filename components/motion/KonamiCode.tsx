'use client'

import { useEffect, useRef, useState } from 'react'
import { MOTION_OK, gsap } from './gsap'

const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

const CELL_COUNT = 28

/** ↑↑↓↓←→←→BA: a toast plus a burst of pixel cells. */
export function KonamiCode() {
  const [active, setActive] = useState(false)
  const burst = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let position = 0

    const onKey = (event: KeyboardEvent) => {
      const { target } = event
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')) return

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      position = key === SEQUENCE[position] ? position + 1 : key === SEQUENCE[0] ? 1 : 0
      if (position === SEQUENCE.length) {
        position = 0
        setActive(true)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!active) return undefined

    const timer = window.setTimeout(() => setActive(false), 4000)
    const cells = burst.current ? Array.from(burst.current.children) : []
    const mm = gsap.matchMedia()

    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        cells,
        { x: 0, y: 0, autoAlpha: 1 },
        {
          x: () => gsap.utils.random(-45, 45, 4) + 'vw',
          y: () => gsap.utils.random(-85, -30, 4) + 'vh',
          autoAlpha: 0,
          duration: 1.6,
          ease: 'steps(12)',
          stagger: 0.02,
        }
      )
    })

    return () => {
      window.clearTimeout(timer)
      mm.revert()
    }
  }, [active])

  if (!active) return null

  return (
    <>
      <div ref={burst} className="pointer-events-none fixed bottom-0 left-1/2 z-[60]" aria-hidden="true">
        {Array.from({ length: CELL_COUNT }, (_, i) => (
          <span
            key={i}
            className="invisible absolute h-3 w-3 bg-[hsl(var(--accent))]"
          />
        ))}
      </div>
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
        <div
          role="status"
          className="pixel-border bg-background px-5 py-3 text-foreground duration-150 animate-in fade-in"
        >
          <p className="pixel-label">Cheat code accepted · +30 lives</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">sudo mode: biologist vision enabled</p>
        </div>
      </div>
    </>
  )
}
