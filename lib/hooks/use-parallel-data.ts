'use client';

import { useState, useEffect } from 'react';

// Generic hook for parallel data fetching at component level
// This pattern allows components to fetch data independently and in parallel
function useParallelData<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = [],
  defaultValue: T | null = null
): { data: T | null; isLoading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, error };
}

export { useParallelData };
