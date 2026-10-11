import { BreadcrumbStructuredData } from '@/components/seo/structured-data';
import { pageMetadata } from '@/lib/seo';

// The contact page is a client component, so its metadata lives here
export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Contact Rachaphol Plookaom, a frontend developer in Bangkok, about freelance projects or full-time roles by email, phone or the contact form.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbStructuredData name="Contact" path="/contact" />
      {children}
    </>
  );
}
