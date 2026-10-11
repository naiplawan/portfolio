'use client'

import { useRef } from 'react'
import { PixelGroup } from '@/components/pixel/PixelSprite'
import { WALKER_FRAMES } from '@/components/pixel/sprites'
import { MOTION_OK, gsap, useGSAP } from './gsap'

const WALKER_WIDTH = 28
const WALKER_HEIGHT = 36

/**
 * Wraps the career `git log` with a commit rail. While the list scrolls past, a pixel
 * walker climbs the rail from the oldest commit (World 1-1) up to HEAD. At rest, and
 * without motion, the walker stands at HEAD.
 */
export function LevelMap({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const walker = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(walker)
        const frames = q('.walker-frame')
        const bottom = () => (root.current?.offsetHeight ?? 0) - WALKER_HEIGHT - 24

        gsap.fromTo(
          walker.current,
          { y: bottom },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top 75%',
              end: 'bottom 45%',
              scrub: 0.3,
              invalidateOnRefresh: true,
              onUpdate: ({ progress }) => {
                const frame = progress >= 1 ? 0 : Math.floor(progress * 24) % frames.length
                frames.forEach((el, i) => gsap.set(el, { autoAlpha: i === frame ? 1 : 0 }))
              },
            },
          }
        )
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <div ref={root} className="relative">
      <span
        className="absolute bottom-6 left-[10px] top-6 border-l-2 border-dashed border-[hsl(var(--rule))]"
        aria-hidden="true"
      />
      <svg
        ref={walker}
        viewBox="0 0 7 9"
        width={WALKER_WIDTH}
        height={WALKER_HEIGHT}
        shapeRendering="crispEdges"
        className="pointer-events-none absolute -left-[3px] top-2 z-10"
        aria-hidden="true"
      >
        {WALKER_FRAMES.map((frame, i) => (
          <PixelGroup key={i} sprite={frame} className="walker-frame" visibility={i === 0 ? undefined : 'hidden'} />
        ))}
      </svg>
      {children}
    </div>
  )
}
