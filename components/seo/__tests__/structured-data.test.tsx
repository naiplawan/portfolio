import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { FaqStructuredData, ProjectsStructuredData, SiteStructuredData } from '../structured-data';
import { FAQ_ITEMS } from '@/lib/data/faq-data';
import { SCHEMA_IDS } from '@/lib/seo';
import type { Project } from '@/lib/types/types';

const jsonLd = (html: string) =>
  JSON.parse(html.replace(/^<script type="application\/ld\+json">/, '').replace(/<\/script>$/, ''));

describe('structured data', () => {
  it('escapes "<" so GitHub text cannot close the script tag', () => {
    const project = {
      id: 1,
      title: 'Evil',
      description: '</script><script>alert(1)</script>',
      problemStatement: '',
      solution: '',
      image: '',
      technologies: [],
      githubUrl: 'https://github.com/naiplawan/evil',
      category: 'other',
      status: 'live',
      featured: false,
      completedYear: 2026,
    } satisfies Project;

    const html = renderToStaticMarkup(<ProjectsStructuredData projects={[project]} />);
    expect(html).not.toContain('</script><script>');
    expect(jsonLd(html).itemListElement[0].item.description).toBe(project.description);
  });

  it('links the website and person through stable ids', () => {
    const graph = jsonLd(renderToStaticMarkup(<SiteStructuredData />))['@graph'];
    const person = graph.find((node: { '@type': string }) => node['@type'] === 'Person');
    const website = graph.find((node: { '@type': string }) => node['@type'] === 'WebSite');
    expect(person['@id']).toBe(SCHEMA_IDS.person);
    expect(website.author['@id']).toBe(SCHEMA_IDS.person);
    expect(person.alumniOf[0].name).toBe('Mahidol University');
  });

  it('mirrors every visible FAQ answer in FAQPage', () => {
    const data = jsonLd(renderToStaticMarkup(<FaqStructuredData items={FAQ_ITEMS} />));
    expect(data.mainEntity).toHaveLength(FAQ_ITEMS.length);
    expect(data.mainEntity[0].acceptedAnswer.text).toBe(FAQ_ITEMS[0].answer);
  });
});
