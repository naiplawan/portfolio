import { SITE_URL } from '@/lib/constants';
import { SCHEMA_IDS, siteGraph } from '@/lib/seo';
import type { FaqItem } from '@/lib/data/faq-data';
import type { Project } from '@/lib/types/types';

/** Renders JSON-LD; `<` is escaped so text from GitHub can't close the script tag. */
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

/** Person, employer and WebSite entities; rendered once in the root layout. */
export function SiteStructuredData() {
  return <JsonLd data={siteGraph()} />;
}

/** Marks the home page as the profile page about the site's Person entity. */
export function ProfilePageStructuredData() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profile`,
        url: SITE_URL,
        mainEntity: { '@id': SCHEMA_IDS.person },
        isPartOf: { '@id': SCHEMA_IDS.website },
      }}
    />
  );
}

export function FaqStructuredData({ items }: { items: readonly FaqItem[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      }}
    />
  );
}

/** The project list as an ItemList of source-code works by the site's Person. */
export function ProjectsStructuredData({ projects }: { projects: readonly Project[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Projects by Rachaphol Plookaom',
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'SoftwareSourceCode',
            name: project.title,
            description: project.description,
            codeRepository: project.githubUrl,
            ...(project.liveUrl && { url: project.liveUrl }),
            ...(project.technologies.length > 0 && { programmingLanguage: project.technologies }),
            dateCreated: String(project.completedYear),
            author: { '@id': SCHEMA_IDS.person },
          },
        })),
      }}
    />
  );
}

export function BreadcrumbStructuredData({ name, path }: { name: string; path: string }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
        ],
      }}
    />
  );
}
