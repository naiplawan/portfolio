'use client';

import { useState, useEffect } from 'react';
import { githubAPI, GitHubStatsData } from '@/lib/github-api';

/**
 * Client-side hook for using GitHub stats in React components
 * This is a client component that can be used in 'use client' components
 */
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
    let mounted = true;

    const fetchStats = async () => {
      try {
        const data = await githubAPI.getGitHubStats();
        if (mounted) {
          setStats(data);
        }
      } catch (error) {
        if (mounted) {
          setStats(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch GitHub stats'
          }));
        }
      }
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  return stats;
}
