import { describe, it, expect } from 'vitest';
import { applyProjectOverrides } from '../projects-data';
import type { Project } from '../../types/types';

const project = (name: string, extra: Partial<Project> = {}): Project => ({
  id: 1,
  title: name,
  description: 'A TypeScript project on GitHub',
  problemStatement: 'A TypeScript project on GitHub',
  solution: 'Built with TypeScript',
  image: '',
  technologies: ['TypeScript'],
  githubUrl: `https://github.com/naiplawan/${name}`,
  category: 'other',
  status: 'live',
  featured: false,
  completedYear: 2026,
  ...extra,
});

describe('applyProjectOverrides', () => {
  it('adds the Vercel URL and description to a repo without a homepage', () => {
    const [result] = applyProjectOverrides([project('rob-ban')]);
    expect(result.liveUrl).toBe('https://rob-baan.vercel.app');
    expect(result.description).toMatch(/wildlife dex/);
    expect(result.problemStatement).toBe(result.description);
  });

  it('removes a stale homepage when the override is null', () => {
    const [result] = applyProjectOverrides([
      project('tourist-attraction-webpage', { liveUrl: 'https://tourist-attraction-webpage.vercel.app' }),
    ]);
    expect(result).not.toHaveProperty('liveUrl');
  });

  it('matches repo names case-insensitively and ignores trailing slashes', () => {
    const [result] = applyProjectOverrides([
      project('Layer-3D', { githubUrl: 'https://github.com/naiplawan/Layer-3D/' }),
    ]);
    expect(result.liveUrl).toBe('https://layer-3d.vercel.app');
  });

  it('leaves other projects untouched', () => {
    const original = project('perd-wai', { liveUrl: 'https://perd-wai.vercel.app' });
    expect(applyProjectOverrides([original])[0]).toBe(original);
  });
});
