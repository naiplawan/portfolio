import AboutMe from '@/components/portfolio/AboutMe';
import Timeline from '@/components/portfolio/Timeline';
import ContactSection from '@/components/sections/ContactSection';
import { BreadcrumbStructuredData } from '@/components/seo/structured-data';
import { pageSeo } from '@/lib/seo';

export const metadata = pageSeo('/about');

export default function AboutPage() {
  return (
    <>
      <BreadcrumbStructuredData name="About" path="/about" />
      <AboutMe />
      <Timeline />
      <ContactSection />
    </>
  );
}
