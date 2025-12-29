import { Project } from '../types/types';
import { fetchProjectsFromGitHub } from '../utils/github-sync';

// GitHub username from environment variable
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'naiplawan';

// Fallback manual projects (shown when GitHub API fails)
const FALLBACK_PROJECTS: readonly Project[] = [
  {
    id: 9999,
    title: 'ByteTrack',
    description:
      'A sophisticated, production-ready calorie tracking and wellness application with beautiful design system and comprehensive food tracking capabilities.',
    problemStatement:
      'Health-conscious individuals needed an intuitive, accurate calorie tracking solution with personalized insights and exceptional user experience.',
    solution:
      'Created a modern web application with Apple/Spotify-inspired design, PostgreSQL for data reliability, and Prisma for type-safe database operations.',
    image: '/assets/byte-track.png',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    githubUrl: 'https://github.com/naiplawan/bytetrack',
    liveUrl: 'https://calorie-diary.vercel.app/',
    highlights: ['Intuitive UI', 'Real-time Tracking', 'Personalized Insights', 'Cross-platform'],
    category: 'wellness',
    status: 'live',
    featured: false,
    completedYear: 2025,
  },
] as const;

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
      sortBy: 'stars',
    });

    if (githubProjects.length > 0) {
      cachedProjects = githubProjects;
      cacheTimestamp = Date.now();
      return githubProjects;
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
