'use client'

import { useRef } from 'react'
import { PixelGroup } from '@/components/pixel/PixelSprite'
import { BACTERIUM, FLAGELLUM_FRAMES, MAGNIFIER } from '@/components/pixel/sprites'
import { MOTION_OK, gsap, stepped, useGSAP } from './gsap'

/** 404 art: a bacterium squirms on a slide while a magnifier sweeps for the missing page. */
export function SpecimenScene({ className }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root)
        const flagella = q('.flagellum')
        let frame = 0

        gsap.set(root.current, { autoAlpha: 1 })
        gsap.to(q('.bacterium'), { x: 2, y: -1, duration: 0.6, ease: stepped(2), yoyo: true, repeat: -1 })
        gsap.to(q('.magnifier'), { x: -22, duration: 2.4, ease: stepped(11), yoyo: true, repeat: -1, repeatDelay: 0.4 })
        gsap.to({}, {
          duration: 0.25,
          repeat: -1,
          onRepeat: () => {
            frame = (frame + 1) % flagella.length
            flagella.forEach((el, i) => gsap.set(el, { autoAlpha: i === frame ? 1 : 0 }))
          },
        })
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <svg
      ref={root}
      viewBox="0 0 48 22"
      shapeRendering="crispEdges"
      className={className}
      role="img"
      aria-label="Pixel art: a bacterium on a microscope slide, with a magnifying glass searching for the missing page."
      data-motion-pending
    >
      {/* Slide */}
      <rect x={2} y={19} width={44} height={1} className="px-m" />
      <g className="bacterium">
        <PixelGroup sprite={BACTERIUM} x={10} y={12} />
        {FLAGELLUM_FRAMES.map((frame, i) => (
          <PixelGroup
            key={i}
            sprite={frame}
            x={24}
            y={11}
            className="flagellum"
            visibility={i === 0 ? undefined : 'hidden'}
          />
        ))}
      </g>
      <PixelGroup sprite={MAGNIFIER} x={30} y={1} className="magnifier" />
    </svg>
  )
}
