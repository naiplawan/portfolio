'use client'

import { lazy, Suspense } from 'react'
import { PersonStructuredData, WebsiteStructuredData } from '@/components/seo/structured-data'
import DeveloperHero from '@/components/sections/DeveloperHero'
import StatsSection from '@/components/sections/StatsSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SkillsSection from '@/components/sections/SkillsSection'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'

// Dynamic imports for 3D components to reduce initial bundle size
const FloatingElements = lazy(() => import('@/components/3d/FloatingElements'))

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rachaphol-portfolio.vercel.app'

  return (
    <>
      <PersonStructuredData
        name="Rachaphol Plookaom"
        jobTitle="Frontend Developer"
        email="rachaphol.plo@gmail.com"
        url={baseUrl}
        location="Bangkok, Thailand"
        skills={[
          'React.js',
          'Next.js',
          'TypeScript',
          'Go',
          'Go Fiber',
          'Flutter',
          'Dart',
          'Node.js',
          'Python',
          'Django',
          'Performance Optimization',
        ]}
        description="Frontend Developer at Unixdev Co., Ltd. specializing in innovative user experiences, performance optimization, and modern web/mobile technologies. Full-stack capabilities with Go and Flutter."
      />

      <WebsiteStructuredData
        name="Rachaphol Plookaom - Portfolio"
        description="Frontend Developer at Unixdev Co., Ltd. specializing in innovative user experiences, performance optimization, and modern web/mobile technologies. Full-stack capabilities with Go and Flutter."
        url={baseUrl}
      />

      {/* ========================================
          DEVELOPER PORTFOLIO MAIN LAYOUT
          ======================================== */}

      {/* Hero Section - Terminal Animation, Typing Effect, Floating Tech Icons */}
      <DeveloperHero />

      {/* Stats Section - Animated Counters */}
      <StatsSection />

      {/* Projects Showcase - Grid with Hover Effects */}
      <ProjectsSection />

      {/* Skills Section - Progress Bars by Category */}
      <SkillsSection />

      {/* About Section - Timeline with Experience */}
      <AboutSection />

      {/* Contact Section - Form + Social Links */}
      <ContactSection />

      {/* Floating 3D Elements (Background Enhancement) */}
      <Suspense
        fallback={
          <div className="py-20 flex justify-center">
            <div className="animate-pulse text-lg text-primary">
              Loading experience...
            </div>
          </div>
        }
      >
        <FloatingElements />
      </Suspense>
    </>
  )
}
