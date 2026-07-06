'use client';

import { useState, useEffect } from 'react';
import { GitHubStatsData } from '@/lib/github-api';

export function useGitHubStats() {
  const [stats, setStats] = useState<GitHubStatsData>({
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    totalCommits: 0,
    topLanguages: [],
    contributions: 0,
    isLoading: true
  });

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/github/stats', {
          cache: 'no-store',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setStats(data);
        }
      } catch (error) {
        if (isMounted) {
          setStats((prev: GitHubStatsData) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch GitHub stats'
          }));
        }
      }
    };

    fetchStats();

    intervalId = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return stats;
}
