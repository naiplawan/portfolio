import { ProfilePageStructuredData } from '@/components/seo/structured-data'
import { AmbientCells } from '@/components/motion/AmbientCells'
import { DnaDivider } from '@/components/motion/DnaDivider'
import DeveloperHero from '@/components/sections/DeveloperHero'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SkillsSection from '@/components/sections/SkillsSection'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'
import FaqSection from '@/components/sections/FaqSection'
import { getProjects } from '@/lib/data/projects-data'
import { OG_IMAGE, PERSON_SUMMARY } from '@/lib/seo'
import type { Metadata } from 'next'

const HOME_TITLE = 'Rachaphol Plookaom — Biologist turned Frontend Developer'

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: PERSON_SUMMARY,
  alternates: { canonical: '/' },
  openGraph: { title: HOME_TITLE, description: PERSON_SUMMARY, url: '/', type: 'profile', images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: HOME_TITLE, description: PERSON_SUMMARY, images: [OG_IMAGE] },
}

export default async function HomePage() {
  const projects = await getProjects()

  return (
    <>
      <ProfilePageStructuredData />

      <AmbientCells />
      <DeveloperHero />
      <ProjectsSection projects={projects} />
      <DnaDivider />
      <SkillsSection />
      <DnaDivider />
      <AboutSection />
      <FaqSection index="04" />
      <ContactSection index="05" />
    </>
  )
}
