import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import HomePage from '@/app/page';

vi.mock('@/lib/data/projects-data', () => ({
  getProjects: () => Promise.reject(new Error('GitHub unavailable')),
}));

describe('homepage featured work', () => {
  it('renders curated case studies and local screenshots without depending on GitHub', async () => {
    const page = document.createElement('div');
    page.innerHTML = renderToStaticMarkup(await HomePage());
    const projects = page.querySelector('#projects');

    expect(Array.from(projects!.querySelectorAll('h3'), (heading) => heading.textContent)).toEqual([
      'Perd Wai', 'Layer 3D', 'Cafe’nMe',
    ]);
    const images = projects!.querySelectorAll('img');
    expect(images).toHaveLength(3);
    for (const image of images) {
      expect(image.alt).not.toBe('');
      expect(image.getAttribute('width')).toBeTruthy();
      expect(image.getAttribute('height')).toBeTruthy();
    }
    expect(projects!.querySelector('a[href="/projects"]')).not.toBeNull();
  });
});
