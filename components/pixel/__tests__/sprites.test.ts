import { describe, it, expect } from 'vitest';
import {
  AVATAR,
  BACTERIUM,
  BRACE_LEFT,
  BRACE_RIGHT,
  CELL,
  CELL_DIVIDING,
  DAUGHTER_CELL,
  FLAGELLUM_FRAMES,
  ICONS,
  MAGNIFIER,
  WALKER_FRAMES,
  type Sprite,
} from '../sprites';

const PALETTE = new Set(['.', 'o', 'h', 's', 'c', 'g', 'p', 'l', 'm']);

const sprites: Record<string, Sprite> = {
  'avatar.head': AVATAR.head,
  'avatar.legs': AVATAR.legs,
  'avatar.laptop': AVATAR.laptop,
  'avatar.flask': AVATAR.flask,
  BRACE_LEFT,
  BRACE_RIGHT,
  CELL,
  CELL_DIVIDING,
  DAUGHTER_CELL,
  BACTERIUM,
  MAGNIFIER,
  ...Object.fromEntries(WALKER_FRAMES.map((frame, i) => [`walker.${i}`, frame])),
  ...Object.fromEntries(FLAGELLUM_FRAMES.map((frame, i) => [`flagellum.${i}`, frame])),
  ...Object.fromEntries(Object.entries(ICONS).map(([name, icon]) => [`icon.${name}`, icon])),
};

describe('pixel sprites', () => {
  it.each(Object.entries(sprites))('%s is a rectangular grid of palette characters', (_, sprite) => {
    const width = sprite[0].length;
    for (const row of sprite) {
      expect(row).toHaveLength(width);
      for (const char of row) expect(PALETTE.has(char)).toBe(true);
    }
  });

  it('avatar parts stack to the declared size', () => {
    const parts = [AVATAR.head, AVATAR.laptop, AVATAR.legs];
    expect(parts.every((part) => part[0].length === AVATAR.width)).toBe(true);
    expect(parts.reduce((height, part) => height + part.length, 0)).toBe(AVATAR.height);
    expect(AVATAR.flask).toHaveLength(AVATAR.laptop.length);
  });

  it('eye pixels sit on skin', () => {
    for (const { x, y } of AVATAR.eyesOpen) expect(AVATAR.head[y][x]).toBe('s');
  });
});
