'use client'

import { useRef } from 'react'
import { MOTION_OK, gsap, useGSAP } from './gsap'

const COLUMNS = 160
const AMPLITUDE = 3
const MID = 4
const WAVELENGTH = 16

/** Strand offset for a column at a given unwind progress (0 = helix, 1 = flat bar). */
const offset = (column: number, progress: number) =>
  Math.round(AMPLITUDE * Math.sin((column / WAVELENGTH) * Math.PI * 2) * (1 - progress))

/**
 * Section divider: a pixel double helix that untwists into a loading bar as it
 * scrolls through the viewport. Purely decorative; at rest it is the helix.
 */
export function DnaDivider() {
  const root = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const top = gsap.utils.toArray<SVGRectElement>('.strand-a', root.current)
        const bottom = gsap.utils.toArray<SVGRectElement>('.strand-b', root.current)
        const rungs = gsap.utils.toArray<SVGRectElement>('.rung', root.current)
        const state = { progress: 0 }

        const render = () => {
          // Quantise progress so the strands move in visible pixel steps
          const p = Math.round(state.progress * 8) / 8
          const filled = Math.round(p * COLUMNS)
          top.forEach((rect, column) => {
            rect.setAttribute('y', String(MID - offset(column, p)))
            rect.setAttribute('class', column < filled ? 'strand-a px-g' : 'strand-a px-l')
          })
          bottom.forEach((rect, column) => {
            rect.setAttribute('y', String(MID + offset(column, p)))
            rect.setAttribute('class', column < filled ? 'strand-b px-g' : 'strand-b px-m')
          })
          rungs.forEach((rect) => rect.setAttribute('opacity', String(1 - p)))
        }

        gsap.to(state, {
          progress: 1,
          ease: 'none',
          onUpdate: render,
          scrollTrigger: {
            trigger: root.current,
            start: 'top 85%',
            end: 'top 35%',
            scrub: true,
          },
        })
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <div className="container-premium" aria-hidden="true">
      <svg
        ref={root}
        viewBox={`0 0 ${COLUMNS} ${MID * 2 + 1}`}
        shapeRendering="crispEdges"
        className="block h-auto w-full"
      >
        {Array.from({ length: COLUMNS }, (_, column) => {
          const dy = offset(column, 0)
          return (
            <g key={column}>
              {column % 4 === 0 && Math.abs(dy) > 1 && (
                <rect
                  className="rung px-m"
                  x={column}
                  y={MID - Math.abs(dy) + 1}
                  width={1}
                  height={Math.abs(dy) * 2 - 1}
                />
              )}
              <rect className="strand-a px-l" x={column} y={MID - dy} width={1} height={1} />
              <rect className="strand-b px-m" x={column} y={MID + dy} width={1} height={1} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
