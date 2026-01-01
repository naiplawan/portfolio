'use client';

import { useState, useEffect } from 'react';
import { GitHubStatsData } from '@/lib/github-api';

/**
 * Client-side hook for using GitHub stats in React components.
 * Fetches data from the internal API route which handles GitHub API calls server-side.
 * This keeps the GitHub token secure and never exposed to the client.
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
    let timeoutId: NodeJS.Timeout;

    const fetchStats = async () => {
      try {
        // Use internal API route instead of direct GitHub API call
        const response = await fetch('/api/github/stats', {
          cache: 'no-store', // Always get fresh data
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
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

    // Optional: Refresh stats every 5 minutes
    timeoutId = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000);

    return () => {
      mounted = false;
      if (timeoutId) clearInterval(timeoutId);
    };
  }, []);

  return stats;
}
