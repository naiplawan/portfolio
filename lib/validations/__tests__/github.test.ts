import { describe, it, expect } from 'vitest';
import {
  GitHubUserSchema,
  GitHubRepoSchema,
  GitHubStatsDataSchema,
  validateGitHubUser,
  validateGitHubRepos,
  validateGitHubStats,
  getLanguageColor,
  LANGUAGE_COLORS,
} from '../github';

describe('GitHub Validation Schemas', () => {
  describe('GitHubUserSchema', () => {
    const validUser = {
      login: 'testuser',
      name: 'Test User',
      public_repos: 42,
      followers: 100,
      following: 50,
      created_at: '2020-01-01T00:00:00Z',
    };

    it('should validate a valid GitHub user', () => {
      const result = GitHubUserSchema.parse(validUser);
      expect(result).toEqual(validUser);
    });

    it('should accept null name field', () => {
      const userWithNullName = { ...validUser, name: null };
      const result = GitHubUserSchema.parse(userWithNullName);
      expect(result.name).toBeNull();
    });

    it('should reject invalid data types', () => {
      expect(() => GitHubUserSchema.parse({ ...validUser, public_repos: -1 })).toThrow();
      expect(() => GitHubUserSchema.parse({ ...validUser, login: 123 })).toThrow();
    });
  });

  describe('GitHubRepoSchema', () => {
    const validRepo = {
      id: 123456789,
      name: 'test-repo',
      full_name: 'testuser/test-repo',
      description: 'A test repository',
      stargazers_count: 10,
      forks_count: 5,
      language: 'TypeScript',
      updated_at: '2024-01-01T00:00:00Z',
      created_at: '2023-01-01T00:00:00Z',
      pushed_at: '2024-01-01T00:00:00Z',
      html_url: 'https://github.com/testuser/test-repo',
      homepage: 'https://testuser.github.io',
      topics: ['typescript', 'testing'],
      fork: false,
      archived: false,
      has_wiki: true,
      has_pages: true,
      owner: {
        login: 'testuser',
      },
    };

    it('should validate a valid GitHub repository', () => {
      const result = GitHubRepoSchema.parse(validRepo);
      expect(result).toEqual(validRepo);
    });

    it('should accept null optional fields', () => {
      const repoWithNulls = {
        ...validRepo,
        description: null,
        language: null,
        pushed_at: null,
        homepage: null,
      };
      const result = GitHubRepoSchema.parse(repoWithNulls);
      expect(result.description).toBeNull();
      expect(result.language).toBeNull();
    });

    it('should reject invalid URLs', () => {
      const invalidUrlRepo = { ...validRepo, html_url: 'not-a-url' };
      expect(() => GitHubRepoSchema.parse(invalidUrlRepo)).toThrow();
    });

    it('should reject negative numbers', () => {
      const invalidNumbersRepo = { ...validRepo, stargazers_count: -1 };
      expect(() => GitHubRepoSchema.parse(invalidNumbersRepo)).toThrow();
    });
  });

  describe('GitHubStatsDataSchema', () => {
    const validStats = {
      totalRepos: 42,
      totalStars: 100,
      totalForks: 50,
      totalCommits: 200,
      topLanguages: [
        { name: 'TypeScript', percentage: 60, color: '#3178c6' },
        { name: 'JavaScript', percentage: 40, color: '#f1e05a' },
      ],
      contributions: 500,
      isLoading: false,
    };

    it('should validate valid GitHub stats', () => {
      const result = GitHubStatsDataSchema.parse(validStats);
      expect(result).toEqual(validStats);
    });

    it('should accept optional error field', () => {
      const statsWithError = { ...validStats, error: 'API rate limit exceeded' };
      const result = GitHubStatsDataSchema.parse(statsWithError);
      expect(result.error).toBe('API rate limit exceeded');
    });

    it('should reject invalid percentage values', () => {
      const invalidPercentage = {
        ...validStats,
        topLanguages: [{ name: 'Test', percentage: 150, color: '#000' }],
      };
      expect(() => GitHubStatsDataSchema.parse(invalidPercentage)).toThrow();
    });
  });
});

describe('Validation Helper Functions', () => {
  describe('validateGitHubUser', () => {
    it('should validate and return typed user data', () => {
      const userData = {
        login: 'testuser',
        name: 'Test',
        public_repos: 10,
        followers: 5,
        following: 3,
        created_at: '2020-01-01T00:00:00Z',
      };
      const result = validateGitHubUser(userData);
      expect(result.login).toBe('testuser');
    });

    it('should throw on invalid data', () => {
      expect(() => validateGitHubUser({ invalid: 'data' } as any)).toThrow();
    });
  });

  describe('validateGitHubRepos', () => {
    it('should validate array of repos', () => {
      const repos = [
        {
          id: 1,
          name: 'repo1',
          full_name: 'user/repo1',
          description: null,
          stargazers_count: 0,
          forks_count: 0,
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
      const result = validateGitHubRepos(repos);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('repo1');
    });
  });

  describe('validateGitHubStats', () => {
    it('should validate stats data', () => {
      const stats = {
        totalRepos: 10,
        totalStars: 50,
        totalForks: 25,
        totalCommits: 100,
        topLanguages: [],
        contributions: 200,
        isLoading: false,
      };
      const result = validateGitHubStats(stats);
      expect(result.totalRepos).toBe(10);
    });
  });
});

describe('Language Color Helper', () => {
  it('should return correct color for known languages', () => {
    expect(getLanguageColor('TypeScript')).toBe('#3178c6');
    expect(getLanguageColor('JavaScript')).toBe('#f1e05a');
    expect(getLanguageColor('Go')).toBe('#00ADD8');
    expect(getLanguageColor('Dart')).toBe('#00B4AB');
  });

  it('should return default color for unknown languages', () => {
    expect(getLanguageColor('UnknownLanguage')).toBe(LANGUAGE_COLORS.Other);
  });

  it('should have all expected language colors', () => {
    const expectedColors = [
      'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'C', 'CSS', 'HTML',
      'Go', 'Rust', 'PHP', 'Swift', 'Kotlin', 'Dart', 'Ruby', 'Shell', 'Vue', 'React'
    ];

    expectedColors.forEach(lang => {
      expect(LANGUAGE_COLORS[lang]).toBeDefined();
      expect(LANGUAGE_COLORS[lang]).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});
