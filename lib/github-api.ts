// Server-side GitHub API service (no React hooks)
// This file can be imported by both server and client components

import {
  validateGitHubUser,
  validateGitHubRepos,
  validateGitHubEvents,
  GitHubUser,
  GitHubRepo,
  GitHubStatsData,
  getLanguageColor,
} from './validations/github';

// Re-export types for backwards compatibility
export type { GitHubUser, GitHubRepo, GitHubStatsData };

interface LanguageStats {
  [language: string]: number;
}

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'naiplawan';
const GITHUB_API_BASE = 'https://api.github.com';
// Use server-only token for better security (not exposed to client)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Default fallback contribution count (configurable via env)
const DEFAULT_CONTRIBUTION_COUNT = parseInt(
  process.env.DEFAULT_CONTRIBUTION_COUNT || '250',
  10
);

class GitHubAPIService {
  private async fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-App',
            // Use server-only token for better security
            ...(GITHUB_TOKEN && {
              'Authorization': `token ${GITHUB_TOKEN}`
            })
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('GitHub API rate limit exceeded');
          }
          throw new Error(`GitHub API error: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  async getUserInfo(): Promise<GitHubUser> {
    const data = await this.fetchWithRetry(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
    return validateGitHubUser(data);
  }

  async getUserRepos(): Promise<GitHubRepo[]> {
    const repos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      // Request additional fields: topics, homepage, etc.
      const pageData = await this.fetchWithRetry(
        `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?` +
        `per_page=${perPage}&page=${page}&sort=updated&` +
        `type=all` // Include both source and forks
      );

      // Validate the page data
      const pageRepos = validateGitHubRepos(pageData);

      if (pageRepos.length === 0) break;
      repos.push(...pageRepos);

      if (pageRepos.length < perPage) break;
      page++;
    }

    return repos;
  }

  async getContributionStats(): Promise<number> {
    try {
      // GitHub's contribution data is not directly available via API
      // We'll estimate based on recent commit activity
      const since = new Date();
      since.setFullYear(since.getFullYear() - 1);

      const eventsData = await this.fetchWithRetry(
        `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events?per_page=100`
      );

      // Validate events data
      const events = validateGitHubEvents(eventsData);

      // Count push events as a proxy for contributions
      const pushEvents = events.filter((event) =>
        event.type === 'PushEvent' &&
        new Date(event.created_at) >= since
      );

      // Estimate contributions (each push event might have multiple commits)
      return pushEvents.reduce((total, event) => {
        return total + (event.payload?.commits?.length || 1);
      }, 0);
    } catch (error) {
      console.warn('Could not fetch contribution stats:', error);
      return DEFAULT_CONTRIBUTION_COUNT; // Use configurable fallback
    }
  }

  calculateLanguageStats(repos: GitHubRepo[]): { name: string; percentage: number; color: string }[] {
    const languageCounts: LanguageStats = {};
    let totalRepos = 0;

    repos.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
        totalRepos++;
      }
    });

    if (totalRepos === 0) {
      return [{ name: 'No languages detected', percentage: 100, color: getLanguageColor('Other') }];
    }

    const sortedLanguages = Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // Top 5 languages

    const totalCount = Object.values(languageCounts).reduce((sum, count) => sum + count, 0);

    return sortedLanguages.map(([language, count]) => ({
      name: language,
      percentage: Math.round((count / totalCount) * 100),
      color: getLanguageColor(language)
    }));
  }

  async getGitHubStats(): Promise<GitHubStatsData> {
    try {
      const [userInfo, repos, contributions] = await Promise.all([
        this.getUserInfo(),
        this.getUserRepos(),
        this.getContributionStats()
      ]);

      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
      const topLanguages = this.calculateLanguageStats(repos);

      return {
        totalRepos: userInfo.public_repos,
        totalStars,
        totalForks,
        totalCommits: contributions,
        topLanguages,
        contributions,
        isLoading: false
      };
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const githubAPI = new GitHubAPIService();

// Re-export the class for testing
export { GitHubAPIService };
