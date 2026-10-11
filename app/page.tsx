import { PersonStructuredData, WebsiteStructuredData } from '@/components/seo/structured-data'
import { AmbientCells } from '@/components/motion/AmbientCells'
import { DnaDivider } from '@/components/motion/DnaDivider'
import DeveloperHero from '@/components/sections/DeveloperHero'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SkillsSection from '@/components/sections/SkillsSection'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'
import { getProjects } from '@/lib/data/projects-data'
import { SITE_URL } from '@/lib/constants'


export default async function HomePage() {
  const baseUrl = SITE_URL
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
        description="Biologist turned Frontend Developer at Unixdev Co., Ltd. B.Sc. Biological Sciences (Mahidol University), now building web and mobile products with React, Next.js, TypeScript, Go and Flutter."
      />

      <WebsiteStructuredData
        name="Rachaphol Plookaom - Portfolio"
        description="Biologist turned Frontend Developer at Unixdev Co., Ltd. B.Sc. Biological Sciences (Mahidol University), now building web and mobile products with React, Next.js, TypeScript, Go and Flutter."
        url={baseUrl}
      />

      <AmbientCells />
      <DeveloperHero />
      <ProjectsSection projects={projects} />
      <DnaDivider />
      <SkillsSection />
      <DnaDivider />
      <AboutSection />
      <ContactSection index="04" />
    </>
  )
}
