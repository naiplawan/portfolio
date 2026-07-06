'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { GA_TRACKING_ID } from './constants';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_TRACKING_ID || typeof window.gtag === 'undefined') return;
    window.gtag('config', GA_TRACKING_ID, {
      page_path: pathname,
    });
  }, [pathname]);

  if (!GA_TRACKING_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

export default Analytics;
