import { Project } from '../types/types';
import { fetchProjectsFromGitHub } from '../utils/github-sync';

// GitHub username from environment variable
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'naiplawan';

// Curated projects used by the portfolio.
const FALLBACK_PROJECTS: readonly Project[] = [
  {
    id: 9999,
    title: 'ByteTrack',
    description:
      'A calorie tracking and wellness application designed to make daily food logging clear and approachable.',
    problemStatement:
      'People tracking their nutrition need a quick way to log food and understand their daily progress without navigating a complicated interface.',
    solution:
      'Built a responsive Next.js application with clear daily summaries, PostgreSQL for persistent data, and Prisma for type-safe database access.',
    image: '/assets/byte-track.png',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    githubUrl: 'https://github.com/naiplawan/bytetrack',
    liveUrl: 'https://calorie-diary.vercel.app/',
    highlights: ['Intuitive UI', 'Real-time Tracking', 'Personalized Insights', 'Cross-platform'],
    category: 'wellness',
    status: 'live',
    featured: true,
    completedYear: 2025,
  },
] as const;

interface ProjectOverride {
  /** Product name when it differs from the repo name */
  readonly title?: string;
  readonly description?: string;
  /** Production URL from Vercel; `null` removes a stale GitHub homepage */
  readonly liveUrl?: string | null;
}

/**
 * Corrections on top of GitHub repo metadata, keyed by repo name (lowercase).
 * Live URLs come from the Vercel project list (`vercel project ls`), checked 2026-10-11.
 */
const PROJECT_OVERRIDES: Readonly<Record<string, ProjectOverride>> = {
  'layer-3d': {
    title: 'Layer 3D',
    description:
      'Website for Layer, a Bangkok 3D-printing service: prototypes, finished parts and small production runs, quoted over LINE in about 10 minutes.',
    liveUrl: 'https://layer-3d.vercel.app',
  },
  'rob-ban': {
    title: 'Rob Baan',
    description:
      "Rob Baan (รอบบ้าน): a wildlife dex for Bangkok's public parks. Spot the animals and plants around you and collect them like a field guide.",
    liveUrl: 'https://rob-baan.vercel.app',
  },
  // No longer deployed: the GitHub homepages point at dead URLs
  'kiddugorn-backend': { liveUrl: null },
  'to-do-list-next-js': { liveUrl: null },
  'tourist-attraction-webpage': { liveUrl: null },
};

const repoName = (githubUrl: string) => githubUrl.replace(/\/+$/, '').split('/').pop()?.toLowerCase() ?? '';

/** Applies {@link PROJECT_OVERRIDES} to projects built from GitHub data. */
export function applyProjectOverrides(projects: readonly Project[]): Project[] {
  return projects.map((project) => {
    const override = PROJECT_OVERRIDES[repoName(project.githubUrl)];
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
  const allProjects = await getProjects();
  return allProjects.filter(project => project.featured);
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
