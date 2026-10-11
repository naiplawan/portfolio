import { ImageResponse } from 'next/og'
import { AVATAR, BRACE_LEFT, BRACE_RIGHT, type Sprite } from '@/components/pixel/sprites'
import { PROFESSIONAL_INFO } from '@/lib/constants'

export const alt = `${PROFESSIONAL_INFO.name}: biologist turned developer`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Light-theme values from app/globals.css
const paper = 'hsl(40, 23%, 97%)'
const ink = 'hsl(30, 10%, 9%)'
const muted = 'hsl(30, 6%, 38%)'
const accent = 'hsl(142, 64%, 28%)'

const PIXEL_COLORS: Record<string, string> = {
  o: ink,
  h: 'hsl(25, 20%, 18%)',
  s: 'hsl(27, 50%, 72%)',
  c: '#ffffff',
  g: accent,
  l: muted,
  p: 'hsla(142, 64%, 28%, 0.18)',
  m: 'hsl(35, 12%, 85%)',
}

const PIXEL = 14

function SpriteImage({ sprite }: { sprite: Sprite }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {sprite.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {[...row].map((char, x) => (
            <div
              key={x}
              style={{ width: PIXEL, height: PIXEL, background: PIXEL_COLORS[char] ?? 'transparent' }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function OpengraphImage() {
  const avatar = [...AVATAR.head, ...AVATAR.laptop, ...AVATAR.legs].map((row, y) =>
    AVATAR.eyesOpen.some((eye) => eye.y === y)
      ? [...row].map((char, x) => (AVATAR.eyesOpen.some((eye) => eye.x === x && eye.y === y) ? 'h' : char)).join('')
      : row
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          background: paper,
          color: ink,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: `2px solid ${ink}`,
            paddingTop: 20,
            fontSize: 24,
            letterSpacing: 2,
            color: muted,
          }}
        >
          <span>
            <span style={{ color: accent }}>~/</span>rachaphol $ whoami
          </span>
          <span>{PROFESSIONAL_INFO.location}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 640 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 92, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }}>
              Biologist turned&nbsp;<span style={{ color: accent }}>developer</span>.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <SpriteImage sprite={BRACE_LEFT} />
            <SpriteImage sprite={avatar} />
            <SpriteImage sprite={BRACE_RIGHT} />
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: muted }}>
          {PROFESSIONAL_INFO.title} · B.Sc. Biological Sciences · React, Next.js, TypeScript, Go, Flutter
        </div>
      </div>
    ),
    size
  )
}
