import './globals.css'
import PageTransition from '@/components/layout/page-transition'

// Force dynamic rendering to avoid Supabase serialization issues
export const dynamic = 'force-dynamic'
import { Providers } from '@/components/layout/providers'
import { Analytics } from '@/components/analytics'
import { SkipLink } from '@/components/accessibility/skip-link'
import { ClientErrorBoundary } from '@/components/layout/error-boundary'
import NavBar from '@/components/portfolio/NavBar'
import Footer from '@/components/portfolio/Footer'
import { Plus_Jakarta_Sans, Outfit, JetBrains_Mono } from 'next/font/google'
import ScrollProgress from '@/components/ui/ScrollProgress'
import FloatingActions from '@/components/ui/FloatingActions'
import { ScrollProgressComponents } from '@/components/ui/scroll-progress'
import { CustomCursor } from '@/components/ui/custom-cursor'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'optional',
  preload: true,
  adjustFontFallback: true,
  weight: ['300', '400', '500', '600', '700', '800'],
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  weight: ['300', '400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false, // Mono font is less critical, don't preload
  adjustFontFallback: true,
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
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192x192.png',
  },
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
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
      <body className="antialiased bg-background text-foreground min-h-screen font-body">
        <SkipLink />
        <Providers>
          <Analytics />
          <CustomCursor />
          <ScrollProgress />
          <NavBar />
          <main id="main-content" tabIndex={-1} className="focus:outline-none min-h-screen pt-14">
            <ClientErrorBoundary>
              <PageTransition variant="fade">
                {children}
              </PageTransition>
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