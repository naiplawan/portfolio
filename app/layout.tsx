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
import { Instrument_Serif, Inter, JetBrains_Mono } from 'next/font/google'
import FloatingActions from '@/components/ui/FloatingActions'
import { ScrollProgressComponents } from '@/components/ui/scroll-progress'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  weight: ['400'],
  style: ['normal', 'italic'],
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
  metadataBase: new URL('https://rachaphol-portfolio.vercel.app'),
  title: {
    default: 'Rachaphol Plookaom - Performance-First Fullstack Architect',
    template: '%s | Rachaphol Plookaom'
  },
  description: 'Award-winning Frontend Developer at Unixdev Co., Ltd. crafting high-performance web applications with React, Next.js, TypeScript, and Go. Delivering scalable solutions that drive measurable business impact.',
  keywords: [
    'frontend developer',
    'fullstack architect', 
    'React expert',
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
  authors: [{ name: 'Rachaphol Plookaom', url: 'https://rachaphol-portfolio.vercel.app' }],
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
    url: 'https://rachaphol-portfolio.vercel.app',
    title: 'Rachaphol Plookaom - Performance-First Fullstack Architect',
    description: 'Award-winning Frontend Developer crafting high-performance web applications with React, Next.js, TypeScript, and Go. Available for hire.',
    siteName: 'Rachaphol Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rachaphol Plookaom - Performance-First Fullstack Architect Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rachaphol Plookaom - Performance-First Fullstack Architect',
    description: 'Award-winning Frontend Developer crafting high-performance web applications. Available for hire.',
    images: ['/og-image.jpg'],
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
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
              "url": "https://rachaphol-portfolio.vercel.app",
              "sameAs": [
                "https://github.com/naiplawan",
                "https://www.linkedin.com/in/rachaphol-plookaom"
              ],
              "knowsAbout": [
                "React.js", "Next.js", "TypeScript", "Go", "Flutter",
                "Performance Optimization", "Web Development"
              ],
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
          <FloatingActions />
          <ScrollProgressComponents />
        </Providers>
      </body>
    </html>
  )
}
