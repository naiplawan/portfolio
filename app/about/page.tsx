import AboutMe from '@/components/portfolio/AboutMe';
import Timeline from '@/components/portfolio/Timeline';
import ContactSection from '@/components/sections/ContactSection';
import { BreadcrumbStructuredData } from '@/components/seo/structured-data';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About',
  description:
    'About Rachaphol Plookaom: B.Sc. Biological Sciences at Mahidol University, TechUp coding bootcamp in 2023, now a frontend developer at Unixdev in Bangkok.',
  path: '/about',
});

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
