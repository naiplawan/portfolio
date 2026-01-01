import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GitHubAPIService } from '../github-api';

// Mock fetch globally
global.fetch = vi.fn();

describe('GitHubAPIService', () => {
  let service: GitHubAPIService;

  beforeEach(() => {
    service = new GitHubAPIService();
    vi.clearAllMocks();
  });

  describe('fetchWithRetry', () => {
    it('should successfully fetch data on first try', async () => {
      const mockData = { test: 'data' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await service['fetchWithRetry']('https://api.test.com/data');
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const mockData = { test: 'data' };
      (global.fetch as any)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });

      const result = await service['fetchWithRetry']('https://api.test.com/data', 3);
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should throw error after exhausting retries', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(service['fetchWithRetry']('https://api.test.com/data', 2))
        .rejects.toThrow('Network error');
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should handle rate limit errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      // Should throw an error (the retry mechanism may wrap it)
      await expect(service['fetchWithRetry']('https://api.test.com/data'))
        .rejects.toBeInstanceOf(Error);
    });
  });

  describe('getUserInfo', () => {
    it('should fetch and validate user info', async () => {
      const mockUser = {
        login: 'testuser',
        name: 'Test User',
        public_repos: 42,
        followers: 100,
        following: 50,
        created_at: '2020-01-01T00:00:00Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await service.getUserInfo();
      expect(result.login).toBe('testuser');
      expect(result.public_repos).toBe(42);
    });

    it('should handle API errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(service.getUserInfo()).rejects.toThrow();
    });
  });

  describe('getUserRepos', () => {
    it('should fetch a single page of repos', async () => {
      const mockRepos = [
        {
          id: 1,
          name: 'repo1',
          full_name: 'user/repo1',
          description: 'Test repo 1',
          stargazers_count: 10,
          forks_count: 5,
          language: 'TypeScript',
          updated_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          pushed_at: '2024-01-01T00:00:00Z',
          html_url: 'https://github.com/user/repo1',
          homepage: null,
          topics: [],
          fork: false,
          archived: false,
          has_wiki: false,
          has_pages: false,
          owner: { login: 'user' },
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      const result = await service.getUserRepos();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('repo1');
    });

    it('should fetch multiple pages of repos', async () => {
      const page1Repos = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `repo${i + 1}`,
        full_name: `user/repo${i + 1}`,
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: 'TypeScript',
        updated_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        pushed_at: '2024-01-01T00:00:00Z',
        html_url: `https://github.com/user/repo${i + 1}`,
        homepage: null,
        topics: [],
        fork: false,
        archived: false,
        has_wiki: false,
        has_pages: false,
        owner: { login: 'user' },
      }));

      const page2Repos = [
        {
          id: 101,
          name: 'repo101',
          full_name: 'user/repo101',
          description: null,
          stargazers_count: 0,
          forks_count: 0,
          language: 'TypeScript',
          updated_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          pushed_at: '2024-01-01T00:00:00Z',
          html_url: 'https://github.com/user/repo101',
          homepage: null,
          topics: [],
          fork: false,
          archived: false,
          has_wiki: false,
          has_pages: false,
          owner: { login: 'user' },
        },
      ];

      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => page1Repos,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => page2Repos,
        });

      const result = await service.getUserRepos();
      expect(result).toHaveLength(101);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('getContributionStats', () => {
    it('should calculate contributions from events', async () => {
      const mockEvents = [
        {
          id: '1',
          type: 'PushEvent',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
          payload: { commits: [{ sha: 'abc123' }, { sha: 'def456' }] },
        },
        {
          id: '2',
          type: 'PushEvent',
          created_at: new Date().toISOString(),
          payload: { commits: [{ sha: 'ghi789' }] },
        },
        {
          id: '3',
          type: 'WatchEvent', // Not a push event
          created_at: new Date().toISOString(),
          payload: {},
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      const result = await service.getContributionStats();
      expect(result).toBe(3); // 2 + 1 commits from push events
    });

    it('should return fallback value on error', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

      const result = await service.getContributionStats();
      // DEFAULT_CONTRIBUTION_COUNT is 250
      expect(result).toBe(250);
    });
  });

  describe('calculateLanguageStats', () => {
    it('should calculate language percentages correctly', () => {
      const repos = [
        { language: 'TypeScript' } as any,
        { language: 'TypeScript' } as any,
        { language: 'JavaScript' } as any,
        { language: 'Go' } as any,
      ];

      const result = service.calculateLanguageStats(repos);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        name: 'TypeScript',
        percentage: 50,
        color: '#3178c6',
      });
      expect(result[1]).toEqual({
        name: 'JavaScript',
        percentage: 25,
        color: '#f1e05a',
      });
      expect(result[2]).toEqual({
        name: 'Go',
        percentage: 25,
        color: '#00ADD8',
      });
    });

    it('should return "No languages detected" when no languages', () => {
      const result = service.calculateLanguageStats([]);
      expect(result).toEqual([
        { name: 'No languages detected', percentage: 100, color: '#6b7280' },
      ]);
    });

    it('should ignore repos with null language', () => {
      const repos = [
        { language: 'TypeScript' } as any,
        { language: null } as any,
        { language: 'JavaScript' } as any,
      ];

      const result = service.calculateLanguageStats(repos);

      expect(result).toHaveLength(2);
      expect(result[0].percentage).toBe(50);
      expect(result[1].percentage).toBe(50);
    });

    it('should limit to top 5 languages', () => {
      const repos = [
        { language: 'TypeScript' } as any,
        { language: 'JavaScript' } as any,
        { language: 'Python' } as any,
        { language: 'Go' } as any,
        { language: 'Rust' } as any,
        { language: 'Java' } as any,
      ];

      const result = service.calculateLanguageStats(repos);
      expect(result).toHaveLength(5);
    });
  });

  describe('getGitHubStats', () => {
    it('should aggregate all stats', async () => {
      const mockUser = {
        login: 'testuser',
        name: 'Test',
        public_repos: 10,
        followers: 5,
        following: 3,
        created_at: '2020-01-01T00:00:00Z',
      };

      const mockRepos = [
        {
          id: 1,
          name: 'repo1',
          full_name: 'user/repo1',
          description: null,
          stargazers_count: 10,
          forks_count: 5,
          language: 'TypeScript',
          updated_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          pushed_at: '2024-01-01T00:00:00Z',
          html_url: 'https://github.com/user/repo1',
          homepage: null,
          topics: [],
          fork: false,
          archived: false,
          has_wiki: false,
          has_pages: false,
          owner: { login: 'user' },
        },
      ];

      const mockEvents = [
        {
          id: '1',
          type: 'PushEvent',
          created_at: new Date().toISOString(),
          payload: { commits: [{ sha: 'abc' }] },
        },
      ];

      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => mockUser })
        .mockResolvedValueOnce({ ok: true, json: async () => mockRepos })
        .mockResolvedValueOnce({ ok: true, json: async () => mockEvents });

      const result = await service.getGitHubStats();

      expect(result.totalRepos).toBe(10);
      expect(result.totalStars).toBe(10);
      expect(result.totalForks).toBe(5);
      expect(result.contributions).toBe(1);
      expect(result.isLoading).toBe(false);
      expect(result.topLanguages).toHaveLength(1);
    });

    it('should handle errors gracefully', async () => {
      (global.fetch as any).mockRejectedValue(new Error('API Error'));

      await expect(service.getGitHubStats()).rejects.toThrow('API Error');
    });
  });
});
