export function GET() {
  const manifest = {
    name: 'Rachaphol Plookaom - Portfolio',
    short_name: 'Rachaphol Portfolio',
    description: 'Experienced fullstack developer specializing in React, Next.js, Node.js, Python, and AI integration.',
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
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      }
    ],
    shortcuts: [
      {
        name: 'View Projects',
        short_name: 'Projects',
        description: 'See my latest projects and work',
        url: '/projects',
        icons: [{ src: '/icons/projects-96x96.png', sizes: '96x96' }]
      },
      {
        name: 'Contact Me',
        short_name: 'Contact',
        description: 'Get in touch for collaboration',
        url: '/contact',
        icons: [{ src: '/icons/contact-96x96.png', sizes: '96x96' }]
      },
      {
        name: 'Read Blog',
        short_name: 'Blog',
        description: 'Read my latest articles',
        url: '/blog',
        icons: [{ src: '/icons/blog-96x96.png', sizes: '96x96' }]
      }
    ]
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}