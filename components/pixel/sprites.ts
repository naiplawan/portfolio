/**
 * Pixel-art sprites as character grids. Each character maps to a `.px-*` class in
 * app/globals.css, so every sprite follows the light/dark theme tokens:
 *
 *   o outline (foreground)   h hair    s skin     c lab coat
 *   g accent (chlorophyll)   p accent tint        l muted     m rule
 *   . transparent
 */
export type Sprite = readonly string[]

interface Circle {
  cx: number
  cy: number
  r: number
}

/** Rasterises overlapping circles into a cell: accent membrane, tinted cytoplasm, nucleus. */
function cellBlob(width: number, height: number, circles: Circle[], nucleus = true): Sprite {
  const inside = (x: number, y: number, inset: number) =>
    circles.some(({ cx, cy, r }) => (x - cx) ** 2 + (y - cy) ** 2 <= (r - inset) ** 2)

  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const px = x + 0.5
      const py = y + 0.5
      if (!inside(px, py, 0)) return '.'
      if (!inside(px, py, 1.2)) return 'g'
      const inNucleus = circles.some(
        ({ cx, cy, r }) => (px - cx) ** 2 + (py - cy) ** 2 <= (r / 3) ** 2
      )
      return nucleus && inNucleus ? 'g' : 'p'
    }).join('')
  )
}

const AVATAR_HEAD: Sprite = [
  '....oooooooo....',
  '...ohhhhhhhho...',
  '...ohhhhhhhho...',
  '...ohssssssho...',
  '...osssssssso...',
  '...osssssssso...',
  '...ossshhssso...',
  '....oossssoo....',
  '......osso......',
  '...occcggccco...',
  '..occccggcccco..',
  '..occcccccccco..',
]

const AVATAR_LEGS: Sprite = [
  '...occcccccco...',
  '...occo..occo...',
  '...oooo..oooo...',
]

/** Rows 12–15 of the avatar: arms holding a laptop with a leaf logo. */
const AVATAR_LAPTOP: Sprite = [
  '..ocllllllllco..',
  '..oclllgglllco..',
  '..ocllllllllco..',
  '..osooooooooso..',
]

/** Rows 12–15 of the avatar: arms holding an Erlenmeyer flask. */
const AVATAR_FLASK: Sprite = [
  '..occccoocccco..',
  '..occcoggoccco..',
  '..occoggggocco..',
  '..osooooooooso..',
]

export const AVATAR = {
  width: 16,
  height: 19,
  head: AVATAR_HEAD,
  legs: AVATAR_LEGS,
  laptop: AVATAR_LAPTOP,
  flask: AVATAR_FLASK,
  /** Eye pixels, drawn on top of the head so they can blink. */
  eyesOpen: [
    { x: 5, y: 4 },
    { x: 10, y: 4 },
    { x: 5, y: 5 },
    { x: 10, y: 5 },
  ],
  eyesClosed: [
    { x: 5, y: 5 },
    { x: 10, y: 5 },
  ],
} as const

export const BRACE_LEFT: Sprite = [
  '..ggg',
  '.gg..',
  '.gg..',
  '.gg..',
  '.gg..',
  'gg...',
  '.gg..',
  '.gg..',
  '.gg..',
  '.gg..',
  '..ggg',
]

export const BRACE_RIGHT: Sprite = BRACE_LEFT.map((row) => [...row].reverse().join(''))

/** One cell, the pinched figure-eight mid-division, and a daughter cell. */
export const CELL = cellBlob(15, 15, [{ cx: 7.5, cy: 7.5, r: 7.5 }])
export const CELL_DIVIDING = cellBlob(21, 13, [
  { cx: 6.5, cy: 6.5, r: 6.5 },
  { cx: 14.5, cy: 6.5, r: 6.5 },
])
export const DAUGHTER_CELL = cellBlob(11, 11, [{ cx: 5.5, cy: 5.5, r: 5.5 }])

/** Small walker for the level map; two frames alternate while scrolling. */
export const WALKER_FRAMES: readonly Sprite[] = [
  [
    '..ooo..',
    '.ohhho.',
    '.ossso.',
    '..ooo..',
    '.ocgco.',
    'o.ccc.o',
    '..ccc..',
    '..o.o..',
    '.oo.oo.',
  ],
  [
    '..ooo..',
    '.ohhho.',
    '.ossso.',
    '..ooo..',
    '.ocgco.',
    '.occco.',
    '..ccc..',
    '.o...o.',
    'oo...oo',
  ],
]

export const BACTERIUM: Sprite = [
  '..oooooooooo..',
  '.oggggggggggo.',
  'ogggoggggogggo',
  'oggggggggggggo',
  '.oggggggggggo.',
  '..oooooooooo..',
]

/** Flagellum frames, drawn to the right of the bacterium. */
export const FLAGELLUM_FRAMES: readonly Sprite[] = [
  ['......', 'o.....', '.o.o.o', '..o.o.', '......', '......'],
  ['......', '..o.o.', '.o.o.o', 'o.....', '......', '......'],
]

export const MAGNIFIER: Sprite = [
  '...oooooo.....',
  '..oppppppo....',
  '.oppppppppo...',
  'oppppppppppo..',
  'oppppppppppo..',
  'oppppppppppo..',
  'oppppppppppo..',
  '.oppppppppo...',
  '..oppppppoo...',
  '...oooooolll..',
  '..........lll.',
  '...........lll',
  '............ll',
]

export const ICONS = {
  globe: [
    '..ooooo..',
    '.o.o.o.o.',
    'o..o.o..o',
    'ooooooooo',
    'o..o.o..o',
    'ooooooooo',
    'o..o.o..o',
    '.o.o.o.o.',
    '..ooooo..',
  ],
  phone: [
    '..ooooo..',
    '..o...o..',
    '..ogggo..',
    '..ogggo..',
    '..ogggo..',
    '..ogggo..',
    '..o...o..',
    '..o.o.o..',
    '..ooooo..',
  ],
  server: [
    'ooooooooo',
    'o.....g.o',
    'ooooooooo',
    'o.....g.o',
    'ooooooooo',
    'o.....g.o',
    'ooooooooo',
    '....o....',
    '..ooooo..',
  ],
  chip: [
    '.o.o.o.o.',
    'ooooooooo',
    '.o.....o.',
    'oo.ggg.oo',
    '.o.ggg.o.',
    'oo.ggg.oo',
    '.o.....o.',
    'ooooooooo',
    '.o.o.o.o.',
  ],
  gamepad: [
    '.........',
    '.ooooooo.',
    'o.......o',
    'o.o...g.o',
    'ooo..g.go',
    'o.o...g.o',
    'o.......o',
    '.ooo.ooo.',
    '.........',
  ],
  flask: [
    '...ooo...',
    '...o.o...',
    '...o.o...',
    '..o...o..',
    '..o...o..',
    '.o.ggg.o.',
    'o.ggggg.o',
    'ogggggggo',
    'ooooooooo',
  ],
} as const satisfies Record<string, Sprite>

export type IconName = keyof typeof ICONS
