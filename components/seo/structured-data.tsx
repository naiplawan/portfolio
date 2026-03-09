interface PersonStructuredDataProps {
  name: string;
  jobTitle: string;
  email?: string;
  url?: string;
  location?: string;
  skills?: string[];
  description?: string;
}

export function PersonStructuredData({
  name,
  jobTitle,
  email,
  url,
  location,
  skills,
  description,
}: PersonStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    description,
    url,
    email: email ? `mailto:${email}` : undefined,
    address: location ? {
      '@type': 'Place',
      name: location,
    } : undefined,
    knowsAbout: skills,
    sameAs: [
      process.env.NEXT_PUBLIC_GITHUB_URL,
      process.env.NEXT_PUBLIC_LINKEDIN_URL,
    ].filter(Boolean),
    worksFor: {
      '@type': 'Organization',
      name: 'Unixdev Co., Ltd.',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}

interface WebsiteStructuredDataProps {
  name: string;
  description: string;
  url: string;
}

export function WebsiteStructuredData({
  name,
  description,
  url,
}: WebsiteStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url,
    author: {
      '@type': 'Person',
      name: 'Rachaphol Plookaom',
    },
    inLanguage: 'en-US',
    copyrightYear: new Date().getFullYear(),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/projects?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}

interface ProjectStructuredDataProps {
  name: string;
  description: string;
  url?: string;
  image?: string;
  technologies: string[];
  dateCreated?: string;
  author: string;
}

export function ProjectStructuredData({
  name,
  description,
  url,
  image,
  technologies,
  dateCreated,
  author,
}: ProjectStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    image,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web Browser',
    programmingLanguage: technologies,
    dateCreated,
    author: {
      '@type': 'Person',
      name: author,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}