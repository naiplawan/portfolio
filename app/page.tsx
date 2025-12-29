'use client';

import ContentSection from '@/components/portfolio/ContentSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import { PersonStructuredData, WebsiteStructuredData } from '@/components/seo/structured-data';

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

      <div className="w-full flex flex-col justify-start">
        <ContentSection />
        <SkillsSection />
      </div>
    </>
  );
}
