import type { Metadata } from 'next';
import { EDUCATION, PROFESSIONAL_INFO, SITE_URL, SOCIAL_LINKS } from './constants';

/** Stable JSON-LD node ids so every page describes the same entities. */
export const SCHEMA_IDS = {
  person: `${SITE_URL}/#person`,
  website: `${SITE_URL}/#website`,
  employer: `${SITE_URL}/#employer`,
} as const;

/** One-sentence, citable summary reused by meta descriptions, JSON-LD and llms.txt. */
export const PERSON_SUMMARY =
  'Rachaphol Plookaom is a Bangkok-based frontend developer at Unixdev Co., Ltd. who moved into software from biology: a B.Sc. in Biological Sciences from Mahidol University, then the TechUp coding bootcamp in 2023.';

export const KNOWS_ABOUT = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'GSAP',
  'Go',
  'Go Fiber',
  'Node.js',
  'Python',
  'Django',
  'Flutter',
  'Dart',
  'PostgreSQL',
  'Web performance',
  'Accessibility',
  'Biological Sciences',
];

export const SAME_AS = [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.facebook];

interface PageMetadataInput {
  title: string;
  description: string;
  /** Path from the site root, e.g. `/about` */
  path: string;
}

/** Title, description, canonical URL and social cards for one page. */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const fullTitle = `${title} | ${PROFESSIONAL_INFO.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: fullTitle, description, url: path, type: 'website' },
    twitter: { card: 'summary_large_image', title: fullTitle, description },
  };
}

/** Person + WebSite graph, rendered once in the root layout. */
export function siteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': SCHEMA_IDS.person,
        name: PROFESSIONAL_INFO.name,
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        jobTitle: PROFESSIONAL_INFO.title,
        description: PERSON_SUMMARY,
        email: `mailto:${SOCIAL_LINKS.email}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Bangkok',
          addressCountry: 'TH',
        },
        worksFor: { '@id': SCHEMA_IDS.employer },
        alumniOf: [
          {
            '@type': 'CollegeOrUniversity',
            name: 'Mahidol University',
            sameAs: 'https://mahidol.ac.th',
          },
          { '@type': 'EducationalOrganization', name: 'TechUp' },
        ],
        hasCredential: {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'degree',
          name: `${EDUCATION.degree.name} in Biological Sciences`,
          recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Mahidol University' },
        },
        knowsAbout: KNOWS_ABOUT,
        sameAs: SAME_AS,
      },
      {
        '@type': 'Organization',
        '@id': SCHEMA_IDS.employer,
        name: PROFESSIONAL_INFO.company,
      },
      {
        '@type': 'WebSite',
        '@id': SCHEMA_IDS.website,
        url: SITE_URL,
        name: `${PROFESSIONAL_INFO.name} — Portfolio`,
        description: PERSON_SUMMARY,
        inLanguage: 'en',
        author: { '@id': SCHEMA_IDS.person },
        publisher: { '@id': SCHEMA_IDS.person },
      },
    ],
  };
}
