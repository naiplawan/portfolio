import { BreadcrumbStructuredData } from '@/components/seo/structured-data';
import { pageSeo } from '@/lib/seo';

// The contact page is a client component, so its metadata lives here
export const metadata = pageSeo('/contact');

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbStructuredData name="Contact" path="/contact" />
      {children}
    </>
  );
}
