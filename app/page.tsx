'use client';

import { lazy, Suspense } from 'react';
import ContentSection from '@/components/portfolio/ContentSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import { PersonStructuredData, WebsiteStructuredData } from '@/components/seo/structured-data';
import { ScrollAnimation } from '@/hooks/useIntersectionObserver';

// Dynamic imports for 3D components to reduce initial bundle size
const ParallaxHero = lazy(() => import('@/components/3d/ParallaxHero'));
const FloatingElements = lazy(() => import('@/components/3d/FloatingElements'));

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rachaphol-portfolio.vercel.app';
  
  return (
    <>
      <PersonStructuredData
        name="Rachaphol Plookaom"
        jobTitle="Frontend Developer"
        email="rachaphol.plo@gmail.com"
        url={baseUrl}
        location="Bangkok, Thailand"
        skills={[
          "React.js", "Next.js", "TypeScript", "Go", "Go Fiber", "Flutter",
          "Dart", "Node.js", "Python", "Django", "Performance Optimization"
        ]}
        description="Frontend Developer at Unixdev Co., Ltd. specializing in innovative user experiences, performance optimization, and modern web/mobile technologies. Full-stack capabilities with Go and Flutter."
      />

      <WebsiteStructuredData
        name="Rachaphol Plookaom - Portfolio"
        description="Frontend Developer at Unixdev Co., Ltd. specializing in innovative user experiences, performance optimization, and modern web/mobile technologies. Full-stack capabilities with Go and Flutter."
        url={baseUrl}
      />

      {/* 3D Hero Section */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-terracotta">Loading 3D Experience...</div>
      </div>}>
        <ParallaxHero />
      </Suspense>

      {/* Floating 3D Elements */}
      <Suspense fallback={<div className="py-20 flex justify-center">
        <div className="animate-pulse text-lg text-terracotta">Loading...</div>
      </div>}>
        <FloatingElements />
      </Suspense>

      {/* Content Sections with Scroll Animations */}
      <ScrollAnimation variant="parallax">
        <div className="relative w-full flex flex-col justify-start bg-gradient-to-b from-cream to-white dark:from-gray-900 dark:to-gray-800">
          <div className="relative z-10">
            <ScrollAnimation variant="fadeInUp">
              <ContentSection />
            </ScrollAnimation>
          </div>

          <ScrollAnimation variant="fadeInUp" delay={0.2}>
            <SkillsSection />
          </ScrollAnimation>
        </div>
      </ScrollAnimation>
    </>
  );
}
