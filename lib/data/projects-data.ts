import { Project } from '../types/types';
import { fetchProjectsFromGitHub } from '../utils/github-sync';
import { PROJECT_OVERRIDES as PROJECT_OVERRIDE_CONTENT } from '../content';
import { CURATED_PROJECTS, FEATURED_PROJECTS } from './featured-projects';

// GitHub username from environment variable
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'naiplawan';

// Curated projects used by the portfolio (edited in the admin: Curated projects).
const FALLBACK_PROJECTS = CURATED_PROJECTS;

interface ProjectOverride {
  /** Product name when it differs from the repo name */
  readonly title?: string;
  readonly description?: string;
  /** Production URL from Vercel; `null` removes a stale GitHub homepage */
  readonly liveUrl?: string | null;
}

/**
 * Corrections on top of GitHub repo metadata, keyed by repo name (lowercase),
 * edited in the admin (GitHub corrections).
 */
const PROJECT_OVERRIDES: Readonly<Record<string, ProjectOverride>> = Object.fromEntries(
  PROJECT_OVERRIDE_CONTENT.items.map(({ repo, title, description, liveUrl }) => [
    repo,
    {
      ...(title && { title }),
      ...(description && { description }),
      ...(liveUrl.discriminant === 'replace' && { liveUrl: liveUrl.value }),
      ...(liveUrl.discriminant === 'remove' && { liveUrl: null }),
    },
  ])
);

const repoName = (githubUrl: string) => githubUrl.replace(/\/+$/, '').split('/').pop()?.toLowerCase() ?? '';

/** Applies {@link PROJECT_OVERRIDES} to projects built from GitHub data. */
export function applyProjectOverrides(projects: readonly Project[]): Project[] {
  return projects.map((project) => {
    const name = repoName(project.githubUrl);
    const curated = FALLBACK_PROJECTS.find((entry) => repoName(entry.githubUrl) === name);
    if (curated) {
      const { liveUrl: _unverifiedUrl, ...repository } = project;
      return { ...repository, ...curated };
    }
    const override = PROJECT_OVERRIDES[name];
    if (!override) return project;

    const { liveUrl, ...rest } = project;
    return {
      ...rest,
      ...(override.title && { title: override.title }),
      ...(override.description && {
        description: override.description,
        problemStatement: override.description,
      }),
      ...(override.liveUrl === null
        ? {}
        : { liveUrl: override.liveUrl ?? liveUrl }),
    };
  });
}

// Projects cache
let cachedProjects: readonly Project[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch projects from GitHub API with fallback to manual projects
 */
export async function getProjects(): Promise<readonly Project[]> {
  // Return cached projects if still valid
  if (cachedProjects && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedProjects;
  }

  try {
    // Fetch from GitHub API
    const githubProjects = await fetchProjectsFromGitHub(GITHUB_USERNAME, {
      includeForks: false, // Don't include forked repos
      minStars: 0, // Show all repos regardless of stars
      sortBy: 'updated',
    });

    if (githubProjects.length > 0) {
      cachedProjects = applyProjectOverrides(githubProjects);
      cacheTimestamp = Date.now();
      return cachedProjects;
    }
  } catch (error) {
    console.warn('GitHub API fetch failed, using fallback projects:', error);
  }

  // Return fallback projects if GitHub API fails
  cachedProjects = FALLBACK_PROJECTS;
  cacheTimestamp = Date.now();
  return FALLBACK_PROJECTS;
}

/**
 * Get all projects (async wrapper for compatibility)
 */
export async function projects(): Promise<readonly Project[]> {
  return getProjects();
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(): Promise<readonly Project[]> {
  return FEATURED_PROJECTS;
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(category: Project['category']): Promise<readonly Project[]> {
  const allProjects = await getProjects();
  return allProjects.filter(project => project.category === category);
}

/**
 * Get projects by status
 */
export async function getProjectsByStatus(status: Project['status']): Promise<readonly Project[]> {
  const allProjects = await getProjects();
  return allProjects.filter(project => project.status === status);
}

// Export fallback projects for direct access if needed
export { FALLBACK_PROJECTS };
