import type { SVGProps } from 'react'
import type { Sprite } from './sprites'

interface PixelRect {
  x: number
  y: number
  width: number
  color: string
}

/** Merges horizontal runs of the same color into one rect to keep the DOM small. */
function toRects(sprite: Sprite): PixelRect[] {
  const rects: PixelRect[] = []
  sprite.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const color = row[x]
      let end = x + 1
      while (end < row.length && row[end] === color) end += 1
      if (color !== '.') rects.push({ x, y, width: end - x, color })
      x = end
    }
  })
  return rects
}

interface PixelGroupProps extends SVGProps<SVGGElement> {
  sprite: Sprite
  x?: number
  y?: number
}

/**
 * Renders a sprite as a `<g>` of crisp rects, for composing inside an `<svg>`.
 * The x/y offset sits on an inner group so GSAP can transform the outer one freely.
 */
export function PixelGroup({ sprite, x = 0, y = 0, ...props }: PixelGroupProps) {
  return (
    <g {...props}>
      <g transform={x || y ? `translate(${x} ${y})` : undefined}>
        {toRects(sprite).map((rect) => (
          <rect
            key={`${rect.x}-${rect.y}`}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={1}
            className={`px-${rect.color}`}
          />
        ))}
      </g>
    </g>
  )
}

interface PixelSpriteProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  sprite: Sprite
  /** Accessible name; omit for decorative sprites. */
  title?: string
}

/** A standalone sprite as its own `<svg>`, scaled with CSS width/height. */
export function PixelSprite({ sprite, title, className, ...props }: PixelSpriteProps) {
  const width = sprite[0]?.length ?? 0
  return (
    <svg
      viewBox={`0 0 ${width} ${sprite.length}`}
      shapeRendering="crispEdges"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title && <title>{title}</title>}
      <PixelGroup sprite={sprite} />
    </svg>
  )
}
