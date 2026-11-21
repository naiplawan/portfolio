import { SEO } from '@/lib/content';

export function GET() {
  const manifest = {
    name: 'Rachaphol Plookaom - Portfolio',
    short_name: 'Rachaphol Portfolio',
    description: SEO.manifestDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#C97C4C',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en-US',
    categories: ['business', 'productivity', 'portfolio'],
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable any'
      }
    ],
    shortcuts: [
      {
        name: 'View Projects',
        short_name: 'Projects',
        description: 'See my latest projects and work',
        url: '/projects',
        icons: [{ src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }]
      },
      {
        name: 'Contact Me',
        short_name: 'Contact',
        description: 'Get in touch for collaboration',
        url: '/contact',
        icons: [{ src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }]
      }
    ]
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
