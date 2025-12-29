// Server-side GitHub API service (no React hooks)
// This file can be imported by both server and client components

interface GitHubUser {
  login: string;
  name: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  pushed_at: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  owner: {
    login: string;
  };
}

interface LanguageStats {
  [language: string]: number;
}

export interface GitHubStatsData {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  contributions: number;
  isLoading: boolean;
  error?: string;
}

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'naiplawan';
const GITHUB_API_BASE = 'https://api.github.com';

// Language colors from GitHub
const LANGUAGE_COLORS: { [key: string]: string } = {
  'TypeScript': '#3178c6',
  'JavaScript': '#f1e05a',
  'Python': '#3572A5',
  'Java': '#b07219',
  'C++': '#f34b7d',
  'C': '#555555',
  'CSS': '#563d7c',
  'HTML': '#e34c26',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'PHP': '#4F5D95',
  'Swift': '#ffac45',
  'Kotlin': '#A97BFF',
  'Dart': '#00B4AB',
  'Ruby': '#701516',
  'Shell': '#89e051',
  'Vue': '#41b883',
  'React': '#61dafb',
  'Other': '#6b7280'
};

class GitHubAPIService {
  private async fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-App',
            // Add GitHub token if available (optional for public data)
            ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
              'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
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
    return this.fetchWithRetry(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
  }

  async getUserRepos(): Promise<GitHubRepo[]> {
    const repos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      // Request additional fields: topics, homepage, etc.
      const pageRepos = await this.fetchWithRetry(
        `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?` +
        `per_page=${perPage}&page=${page}&sort=updated&` +
        `type=all` // Include both source and forks
      );

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

      const events = await this.fetchWithRetry(
        `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events?per_page=100`
      );

      // Count push events as a proxy for contributions
      const pushEvents = events.filter((event: any) =>
        event.type === 'PushEvent' &&
        new Date(event.created_at) >= since
      );

      // Estimate contributions (each push event might have multiple commits)
      return pushEvents.reduce((total: number, event: any) => {
        return total + (event.payload?.commits?.length || 1);
      }, 0);
    } catch (error) {
      console.warn('Could not fetch contribution stats:', error);
      return 250; // Fallback value
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
      return [{ name: 'No languages detected', percentage: 100, color: LANGUAGE_COLORS.Other }];
    }

    const sortedLanguages = Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // Top 5 languages

    const totalCount = Object.values(languageCounts).reduce((sum, count) => sum + count, 0);

    return sortedLanguages.map(([language, count]) => ({
      name: language,
      percentage: Math.round((count / totalCount) * 100),
      color: LANGUAGE_COLORS[language] || LANGUAGE_COLORS.Other
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

export const githubAPI = new GitHubAPIService();
