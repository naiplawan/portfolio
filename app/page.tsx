import { PersonStructuredData, WebsiteStructuredData } from '@/components/seo/structured-data'
import DeveloperHero from '@/components/sections/DeveloperHero'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SkillsSection from '@/components/sections/SkillsSection'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'
import { getProjects } from '@/lib/data/projects-data'


export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rachaphol-portfolio.vercel.app'
  const projects = await getProjects()

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

      <DeveloperHero />
      <ProjectsSection projects={projects} />
      <SkillsSection />
      <AboutSection />
      <ContactSection index="04" />
    </>
  )
}
