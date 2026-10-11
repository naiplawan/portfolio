'use client'

import { useRef } from 'react'
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from './gsap'

interface DecodeTextProps {
  text: string
  className?: string
}

/**
 * Scrambles short label text into place once, like a terminal resolving output.
 * The real text is rendered on the server and is what screen readers get.
 */
export function DecodeText({ text, className }: DecodeTextProps) {
  const root = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const trigger = ScrollTrigger.create({
          trigger: root.current,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(root.current, {
              duration: 0.8,
              scrambleText: { text, chars: '01<>/{}#*', speed: 0.6, revealDelay: 0.2 },
            })
          },
        })
        return () => trigger.kill()
      })

      return () => mm.revert()
    },
    { scope: root, dependencies: [text] }
  )

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={root} aria-hidden="true">
        {text}
      </span>
    </span>
  )
}
