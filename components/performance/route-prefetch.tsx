'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Prefetch important routes on mount for faster navigation
 */
export function RoutePrefetch() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch common routes for instant navigation
    const routesToPrefetch = [
      '/about',
      '/projects',
      '/blog',
      '/contact',
    ];

    // Small delay to not interfere with initial page load
    const prefetchTimeout = setTimeout(() => {
      routesToPrefetch.forEach(route => {
        router.prefetch(route);
      });
    }, 1000);

    return () => clearTimeout(prefetchTimeout);
  }, [router]);

  return null;
}
