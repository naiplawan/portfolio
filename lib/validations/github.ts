import { z } from 'zod';

/**
 * Zod schemas for validating GitHub API responses
 * This ensures type safety and runtime validation for external API data
 */

// Language color palette from GitHub
export const LANGUAGE_COLORS: { [key: string]: string } = {
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

// GitHub User Schema
export const GitHubUserSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  public_repos: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
  created_at: z.string(),
});

export type GitHubUser = z.infer<typeof GitHubUserSchema>;

// GitHub Repository Owner Schema
export const GitHubRepoOwnerSchema = z.object({
  login: z.string(),
});

// GitHub Repository Schema
export const GitHubRepoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  language: z.string().nullable(),
  updated_at: z.string(),
  created_at: z.string(),
  pushed_at: z.string().nullable(),
  html_url: z.string().url(),
  homepage: z.string().url().nullable(),
  topics: z.array(z.string()),
  fork: z.boolean(),
  archived: z.boolean(),
  has_wiki: z.boolean(),
  has_pages: z.boolean(),
  owner: GitHubRepoOwnerSchema,
});

export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

// GitHub Event Schema (for contribution tracking)
export const GitHubEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  created_at: z.string(),
  payload: z.object({
    commits: z.array(z.object({
      sha: z.string(),
    })).optional(),
  }).passthrough(),
});

export type GitHubEvent = z.infer<typeof GitHubEventSchema>;

// Language Stats Schema
export const LanguageStatsSchema = z.object({
  name: z.string(),
  percentage: z.number().int().min(0).max(100),
  color: z.string(),
});

export type LanguageStats = z.infer<typeof LanguageStatsSchema>;

// GitHub Stats Data Schema (full response)
export const GitHubStatsDataSchema = z.object({
  totalRepos: z.number().int().nonnegative(),
  totalStars: z.number().int().nonnegative(),
  totalForks: z.number().int().nonnegative(),
  totalCommits: z.number().int().nonnegative(),
  topLanguages: z.array(LanguageStatsSchema),
  contributions: z.number().int().nonnegative(),
  isLoading: z.boolean(),
  error: z.string().optional(),
});

export type GitHubStatsData = z.infer<typeof GitHubStatsDataSchema>;

// API Response Schema for error responses
export const GitHubErrorResponseSchema = z.object({
  totalRepos: z.number().int().nonnegative(),
  totalStars: z.number().int().nonnegative(),
  totalForks: z.number().int().nonnegative(),
  totalCommits: z.number().int().nonnegative(),
  topLanguages: z.array(LanguageStatsSchema),
  contributions: z.number().int().nonnegative(),
  isLoading: z.boolean(),
  error: z.string(),
});

export type GitHubErrorResponse = z.infer<typeof GitHubErrorResponseSchema>;

/**
 * Helper function to safely get language color
 */
export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] || LANGUAGE_COLORS.Other;
}

/**
 * Validation helper functions
 */
export const validateGitHubUser = (data: unknown): GitHubUser => {
  return GitHubUserSchema.parse(data);
};

export const validateGitHubRepos = (data: unknown): GitHubRepo[] => {
  return z.array(GitHubRepoSchema).parse(data);
};

export const validateGitHubEvents = (data: unknown): GitHubEvent[] => {
  return z.array(GitHubEventSchema).parse(data);
};

export const validateGitHubStats = (data: unknown): GitHubStatsData => {
  return GitHubStatsDataSchema.parse(data);
};
