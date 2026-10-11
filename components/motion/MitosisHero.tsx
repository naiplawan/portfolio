'use client'

import { useRef, useState } from 'react'
import { PixelGroup } from '@/components/pixel/PixelSprite'
import {
  AVATAR,
  BRACE_LEFT,
  BRACE_RIGHT,
  CELL,
  CELL_DIVIDING,
  DAUGHTER_CELL,
} from '@/components/pixel/sprites'
import { cn } from '@/lib/utils/cn'
import { MOTION_OK, gsap, stepped, useGSAP } from './gsap'

const AVATAR_X = 24
const AVATAR_Y = 9

interface EyesProps {
  pixels: readonly { x: number; y: number }[]
  className: string
  hidden?: boolean
}

function Eyes({ pixels, className, hidden }: EyesProps) {
  return (
    <g className={className} visibility={hidden ? 'hidden' : undefined}>
      {pixels.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} className="px-h" />
      ))}
    </g>
  )
}

/**
 * Signature hero asset: a cell divides, the daughter cells become `{ }`, and a
 * pixel me materialises between them, swapping the lab flask for a laptop.
 * Then it idles, follows the pointer with its eyes, drifts on scroll, and replays on click.
 * The server render is the final frame; the timeline only runs when motion is allowed.
 */
export function MitosisHero({ className }: { className?: string }) {
  const wrapper = useRef<HTMLDivElement>(null)
  const root = useRef<SVGSVGElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)
  const idle = useRef<gsap.core.Timeline | null>(null)
  const [canReplay, setCanReplay] = useState(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root)
        const hidden = { autoAlpha: 0 }

        gsap.set(q('.cell'), { autoAlpha: 1 })
        gsap.set(q('.dividing, .daughter, .brace, .avatar, .laptop, .eyes-closed'), hidden)
        gsap.set(q('.flask'), { autoAlpha: 1 })
        gsap.set(root.current, { autoAlpha: 1 })

        const introTl = gsap.timeline({ delay: 0.3 })
        introTl
          .to(q('.cell'), { scale: 1.12, svgOrigin: '32.5 17.5', duration: 0.3, ease: stepped(2), repeat: 3, yoyo: true })
          .set(q('.cell'), hidden)
          .set(q('.dividing'), { autoAlpha: 1 })
          .to(q('.dividing'), { scaleX: 1.08, svgOrigin: '32.5 17.5', duration: 0.24, ease: stepped(2), yoyo: true, repeat: 1 })
          .set(q('.dividing'), hidden)
          .set(q('.daughter'), { autoAlpha: 1 })
          .to(q('.daughter-left'), { x: -14, duration: 0.6, ease: stepped(7) }, '<')
          .to(q('.daughter-right'), { x: 13, duration: 0.6, ease: stepped(7) }, '<')
          .to(q('.daughter'), { autoAlpha: 0, duration: 0.24, ease: stepped(3) })
          .to(q('.brace'), { autoAlpha: 1, duration: 0.24, ease: stepped(3) }, '<')
          .fromTo(
            q('.avatar'),
            { autoAlpha: 0, y: 4 },
            { autoAlpha: 1, y: 0, duration: 0.4, ease: stepped(4) },
            '+=0.1'
          )
          .to(q('.flask'), { autoAlpha: 0, duration: 0.3, ease: stepped(3), repeat: 1, yoyo: true }, '+=0.5')
          .set(q('.flask'), hidden)
          .set(q('.laptop'), { autoAlpha: 1 })
          .from(q('.laptop'), { y: 1, duration: 0.2, ease: stepped(1) })

        // Idle loop: a 1px bob, an occasional blink, and the braces breathing
        const idleTl = gsap.timeline({ paused: true, repeat: -1 })
        idleTl
          .to(q('.avatar'), { y: -1, duration: 0.5, ease: stepped(1), yoyo: true, repeat: 5 })
          .to(q('.brace'), { scaleY: 1.1, svgOrigin: '32 17.5', duration: 0.5, ease: stepped(1), yoyo: true, repeat: 1 }, 0.5)
          .set(q('.eyes-open'), hidden, '-=0.6')
          .set(q('.eyes-closed'), { autoAlpha: 1 }, '<')
          .set(q('.eyes-open'), { autoAlpha: 1 }, '+=0.15')
          .set(q('.eyes-closed'), hidden, '<')

        introTl.eventCallback('onComplete', () => {
          idleTl.play(0)
        })
        intro.current = introTl
        idle.current = idleTl
        setCanReplay(true)

        // Gentle parallax while the hero scrolls away
        gsap.to(wrapper.current, {
          y: -48,
          ease: 'none',
          scrollTrigger: { trigger: wrapper.current, start: 'top 40%', end: 'bottom top', scrub: 0.5 },
        })

        return () => {
          intro.current = null
          idle.current = null
          setCanReplay(false)
        }
      })

      // Eyes follow a fine pointer, one pixel at a time
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const eyes = root.current?.querySelector('.eyes')
        const moveEyes = gsap.quickSetter(eyes ?? [], 'x')
        const tiltEyes = gsap.quickSetter(eyes ?? [], 'y')

        const onMove = (event: PointerEvent) => {
          const box = root.current?.getBoundingClientRect()
          if (!box) return
          // The avatar's eyes sit around (32, 14) in the 64 x 36 viewBox
          const eyeX = box.left + (box.width * 32) / 64
          const eyeY = box.top + (box.height * 14) / 36
          const dx = event.clientX - eyeX
          const dy = event.clientY - eyeY
          moveEyes(Math.abs(dx) < 24 ? 0 : Math.sign(dx))
          tiltEyes(Math.abs(dy) < 24 ? 0 : Math.sign(dy))
        }

        window.addEventListener('pointermove', onMove)
        return () => window.removeEventListener('pointermove', onMove)
      })

      return () => mm.revert()
    },
    { scope: wrapper }
  )

  const replay = () => {
    idle.current?.pause(0)
    intro.current?.restart(true)
  }

  return (
    <div ref={wrapper} className={cn('relative', className)}>
      <svg
        ref={root}
        viewBox="0 0 64 36"
        shapeRendering="crispEdges"
        className="block w-full"
        role="img"
        aria-label="Pixel art: a cell divides into code braces, and a pixel developer appears between them holding a laptop."
        data-motion-pending
      >
        {/* Floor */}
        <g className="px-m">
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={4 + i * 4} y={30} width={2} height={1} />
          ))}
        </g>

        <PixelGroup sprite={CELL} x={25} y={10} className="cell" visibility="hidden" />
        <PixelGroup sprite={CELL_DIVIDING} x={22} y={11} className="dividing" visibility="hidden" />
        <PixelGroup sprite={DAUGHTER_CELL} x={21} y={12} className="daughter daughter-left" visibility="hidden" />
        <PixelGroup sprite={DAUGHTER_CELL} x={33} y={12} className="daughter daughter-right" visibility="hidden" />

        <PixelGroup sprite={BRACE_LEFT} x={10} y={12} className="brace" />
        <PixelGroup sprite={BRACE_RIGHT} x={49} y={12} className="brace" />

        <g className="avatar">
          <g transform={`translate(${AVATAR_X} ${AVATAR_Y})`}>
            <PixelGroup sprite={AVATAR.head} />
            <g className="eyes">
              <Eyes pixels={AVATAR.eyesOpen} className="eyes-open" />
              <Eyes pixels={AVATAR.eyesClosed} className="eyes-closed" hidden />
            </g>
            <PixelGroup sprite={AVATAR.flask} y={12} className="flask" visibility="hidden" />
            <PixelGroup sprite={AVATAR.laptop} y={12} className="laptop" />
            <PixelGroup sprite={AVATAR.legs} y={16} />
          </g>
        </g>
      </svg>

      {canReplay && (
        <button
          type="button"
          onClick={replay}
          className="pixel-label absolute bottom-0 right-0 text-muted-foreground transition-colors hover:text-[hsl(var(--accent))] active:translate-y-px"
        >
          ↻ replay
        </button>
      )}
    </div>
  )
}
