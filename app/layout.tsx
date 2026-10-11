import './globals.css'
import { Providers } from '@/components/layout/providers'
import nextDynamic from 'next/dynamic'

// Lazy load analytics to reduce initial bundle size and improve time to interactive
// Note: Analytics component is already a client component, so we just use dynamic for code splitting
const Analytics = nextDynamic(() => import('@/components/analytics').then(mod => ({ default: mod.Analytics })), {
  loading: () => null, // Show nothing while loading to avoid layout shift
})
import { SkipLink } from '@/components/accessibility/skip-link'
import { ClientErrorBoundary } from '@/components/layout/error-boundary'
import NavBar from '@/components/portfolio/NavBar'
import Footer from '@/components/portfolio/Footer'
import { KonamiCode } from '@/components/motion/KonamiCode'
import { SITE_URL } from '@/lib/constants'
import { Geist, Inter, JetBrains_Mono, Silkscreen } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  weight: ['500', '600'],
})

const silkscreen = Silkscreen({
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
  preload: true,
  weight: ['400'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
  weight: ['400', '500'],
})


export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Rachaphol Plookaom — Frontend Developer',
    template: '%s | Rachaphol Plookaom'
  },
  description: 'Biologist turned frontend developer in Bangkok, building fast, accessible web and mobile products with React, Next.js, TypeScript, Go, and Flutter.',
  keywords: [
    'frontend developer',
    'React developer',
    'Next.js developer',
    'TypeScript',
    'Go developer',
    'Flutter',
    'performance optimization',
    'web development',
    'software engineer',
    'Unixdev',
    'Bangkok developer',
    'portfolio',
    'hire developer'
  ],
  authors: [{ name: 'Rachaphol Plookaom', url: SITE_URL }],
  creator: 'Rachaphol Plookaom',
  publisher: 'Rachaphol Plookaom',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: 'Rachaphol Plookaom — Frontend Developer',
    description: 'Biologist turned frontend developer in Bangkok, building fast, accessible web and mobile products with React, Next.js, TypeScript, Go, and Flutter.',
    siteName: 'Rachaphol Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rachaphol Plookaom — Frontend Developer',
    description: 'Biologist turned frontend developer in Bangkok, building fast, accessible web and mobile products.',
    creator: '@rachaphol'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || undefined,
  },
  icons: {
    icon: [
      { url: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    shortcut: '/icons/icon.svg',
  },
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable} ${silkscreen.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Let GSAP assets hide their first frame until hydration (see .motion-ok in globals.css)
              if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
                document.documentElement.classList.add('motion-ok');
              }

              // Prevent flash of wrong theme
              (function() {
                const themeKey = 'portfolio-theme';
                const stored = localStorage.getItem(themeKey);
                if (stored) {
                  try {
                    const parsed = stored[0] === '{' || stored[0] === '"' ? JSON.parse(stored) : stored;
                    const theme = typeof parsed === 'string' ? parsed : parsed && parsed.theme;
                    if (theme === 'dark' || theme === 'light') {
                      document.documentElement.classList.add(theme);
                    } else if (theme === 'system') {
                      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                      document.documentElement.classList.add(systemTheme);
                    }
                  } catch (e) {
                    console.error('Error parsing theme:', e);
                  }
                }
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Rachaphol Plookaom",
              "jobTitle": "Frontend Developer",
              "worksFor": {
                "@type": "Organization",
                "name": "Unixdev Co., Ltd."
              },
              "url": SITE_URL,
              "sameAs": [
                "https://github.com/naiplawan",
                "https://www.linkedin.com/in/rachaphol-plookaom"
              ],
              "knowsAbout": [
                "React.js", "Next.js", "TypeScript", "Go", "Flutter",
                "Performance Optimization", "Web Development", "Biological Sciences"
              ],
              "alumniOf": {
                "@type": "CollegeOrUniversity",
                "name": "Mahidol University"
              },
              "email": "rachaphol.plo@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bangkok",
                "addressCountry": "Thailand"
              }
            })
          }}
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen font-body overflow-x-hidden max-w-full">
        <SkipLink />
        <Providers>
          <Analytics />
          <NavBar />
          <main id="main-content" tabIndex={-1} className="focus:outline-none min-h-screen pt-14">
            <ClientErrorBoundary>
              {children}
            </ClientErrorBoundary>
          </main>
          <Footer />
          <KonamiCode />
        </Providers>
      </body>
    </html>
  )
}
