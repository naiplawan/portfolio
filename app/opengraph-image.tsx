import { ImageResponse } from 'next/og'
import { PROFESSIONAL_INFO } from '@/lib/constants'

export const alt = `${PROFESSIONAL_INFO.name} — ${PROFESSIONAL_INFO.title}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Editorial palette from app/globals.css (light theme)
const paper = 'hsl(40, 23%, 97%)'
const ink = 'hsl(30, 10%, 9%)'
const muted = 'hsl(30, 6%, 38%)'
const accent = 'hsl(11, 76%, 45%)'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
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
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: muted,
          }}
        >
          <span>{PROFESSIONAL_INFO.name}</span>
          <span>{PROFESSIONAL_INFO.location}</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 84, lineHeight: 1.05, letterSpacing: -3 }}>
          I build fast, accessible interfaces for the&nbsp;
          <span style={{ color: accent }}>web</span>
          &nbsp;and&nbsp;
          <span style={{ color: accent }}>mobile</span>.
        </div>

        <div style={{ display: 'flex', fontSize: 28, color: muted }}>
          {PROFESSIONAL_INFO.title} · React, Next.js, TypeScript, Go, Flutter
        </div>
      </div>
    ),
    size
  )
}
