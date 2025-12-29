// GitHub to Project transformation utilities
import { GitHubRepo } from '../github-api';
import { Project } from '../types/types';

interface GitHubToProjectOptions {
  includeForks?: boolean;
  minStars?: number;
  excludeTopics?: string[];
  onlyTopics?: string[];
  sortBy?: 'stars' | 'updated' | 'name';
}

/**
 * Transform a GitHub repository into a Project object
 */
export function githubRepoToProject(
  repo: GitHubRepo,
  _username: string,
  options: GitHubToProjectOptions = {}
): Project {
  const {
    includeForks = false,
    minStars = 0,
    excludeTopics = [],
    onlyTopics = [],
  } = options;

  // Skip forks if not included
  if (!includeForks && repo.fork) {
    return null as any;
  }

  // Skip if below minimum stars
  if (repo.stargazers_count < minStars) {
    return null as any;
  }

  // Filter by topics if specified
  const repoTopics = repo.topics || [];
  if (onlyTopics.length > 0) {
    if (!onlyTopics.some(topic => repoTopics.includes(topic))) {
      return null as any;
    }
  }

  if (excludeTopics.length > 0) {
    if (excludeTopics.some(topic => repoTopics.includes(topic))) {
      return null as any;
    }
  }

  // Determine status based on repo data
  const isRecentlyUpdated = () => {
    const updatedAt = new Date(repo.updated_at);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return updatedAt > threeMonthsAgo;
  };

  const status: Project['status'] = repo.archived
    ? 'archived'
    : isRecentlyUpdated()
    ? 'live'
    : 'development';

  // Determine category based on topics/language
  const determineCategory = (repo: GitHubRepo): Project['category'] => {
    const topics = repo.topics || [];
    const topicLower = topics.map(t => t.toLowerCase());

    if (topicLower.includes('web') || topicLower.includes('frontend') || topicLower.includes('website')) {
      return 'web';
    }
    if (topicLower.includes('mobile') || topicLower.includes('ios') || topicLower.includes('android')) {
      return 'mobile';
    }
    if (topicLower.includes('api') || topicLower.includes('backend') || topicLower.includes('server')) {
      return 'backend';
    }
    if (topicLower.includes('ml') || topicLower.includes('ai') || topicLower.includes('machine-learning')) {
      return 'ai';
    }
    if (topicLower.includes('game') || topicLower.includes('gaming')) {
      return 'gaming';
    }
    if (topicLower.includes('tool') || topicLower.includes('utility') || topicLower.includes('cli')) {
      return 'tools';
    }
    return 'other';
  };

  // Extract technologies from language and topics
  const extractTechnologies = (repo: GitHubRepo): string[] => {
    const technologies: string[] = [];

    // Add primary language
    if (repo.language) {
      technologies.push(repo.language);
    }

    // Add relevant topics as technologies
    const techTopics = repo.topics?.filter(topic => {
      const lower = topic.toLowerCase();
      return ['react', 'vue', 'angular', 'nextjs', 'typescript', 'javascript', 'python', 'go', 'rust', 'java', 'docker', 'kubernetes', 'nodejs', 'express', 'mongodb', 'postgresql'].includes(lower);
    }) || [];

    technologies.push(...techTopics);

    return [...new Set(technologies)]; // Remove duplicates
  };

  // Generate a problem statement based on repo description
  const generateProblemStatement = (repo: GitHubRepo): string => {
    if (repo.description) {
      return repo.description;
    }
    return `A ${repo.language || 'software'} project to solve a specific problem.`;
  };

  // Generate a solution based on repo data
  const generateSolution = (repo: GitHubRepo): string => {
    const parts: string[] = [];

    if (repo.language) {
      parts.push(`Built with ${repo.language}`);
    }

    if (repo.stargazers_count > 0) {
      parts.push(`⭐ ${repo.stargazers_count} stars`);
    }

    if (repo.forks_count > 0) {
      parts.push(`🍴 ${repo.forks_count} forks`);
    }

    return parts.length > 0 ? parts.join(' • ') : 'A software project with innovative solutions.';
  };

  // Generate placeholder image URL (using GitHub's default repo icon)
  const generateImage = (repo: GitHubRepo): string => {
    return `https://opengraph.githubassets.com/${repo.owner.login}/${repo.name}/github-open-graph.png`;
  };

  // Generate highlights from topics
  const generateHighlights = (repo: GitHubRepo): string[] => {
    const highlights: string[] = [];

    if (repo.topics) {
      highlights.push(...repo.topics.slice(0, 5));
    }

    // Add stats as highlights
    if (repo.stargazers_count > 10) {
      highlights.push(`${repo.stargazers_count}+ stars`);
    }
    if (repo.forks_count > 5) {
      highlights.push(`${repo.forks_count}+ forks`);
    }
    if (repo.has_wiki) {
      highlights.push('Documentation');
    }
    if (repo.has_pages) {
      highlights.push('GitHub Pages');
    }

    return highlights.slice(0, 6);
  };

  const completedYear = new Date(repo.created_at).getFullYear();

  return {
    id: repo.id,
    title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Convert kebab-case to Title Case
    description: repo.description || `A ${repo.language || 'software'} project on GitHub`,
    problemStatement: generateProblemStatement(repo),
    solution: generateSolution(repo),
    image: generateImage(repo),
    technologies: extractTechnologies(repo),
    githubUrl: repo.html_url,
    liveUrl: repo.homepage || undefined,
    highlights: generateHighlights(repo),
    category: determineCategory(repo),
    status,
    featured: repo.stargazers_count >= 10, // Auto-feature repos with 10+ stars
    completedYear,
    metrics: {
      users: repo.forks_count > 0 ? `${repo.forks_count} forks` : undefined,
      performance: repo.stargazers_count > 0 ? `${repo.stargazers_count} stars` : undefined,
      responseTime: repo.updated_at ? `Updated ${new Date(repo.updated_at).toLocaleDateString()}` : undefined,
    },
  };
}

/**
 * Fetch and transform GitHub repositories into Projects
 */
export async function fetchProjectsFromGitHub(
  username: string,
  options: GitHubToProjectOptions = {}
): Promise<readonly Project[]> {
  const GitHubAPIService = (await import('../github-api')).githubAPI;

  try {
    const repos = await GitHubAPIService.getUserRepos();

    // Transform repos to projects
    const projects = repos
      .map(repo => githubRepoToProject(repo, username, options))
      .filter(project => project !== null)
      .sort((a, b) => {
        // Sort by stars descending
        const aStars = a.metrics?.performance ? parseInt(a.metrics.performance) || 0 : 0;
        const bStars = b.metrics?.performance ? parseInt(b.metrics.performance) || 0 : 0;
        return bStars - aStars;
      });

    return projects as Project[];
  } catch (error) {
    console.error('Error fetching projects from GitHub:', error);
    return [];
  }
}

/**
 * Get fallback projects (manual list) when GitHub API fails
 */
export async function getProjectsWithFallback(
  username: string,
  options: GitHubToProjectOptions = {}
): Promise<{ projects: readonly Project[]; source: 'github' | 'fallback' }> {
  try {
    const projects = await fetchProjectsFromGitHub(username, options);

    if (projects.length > 0) {
      return { projects, source: 'github' as const };
    }
  } catch (error) {
    console.warn('GitHub API failed, using fallback:', error);
  }

  // Import fallback projects
  const { getProjects } = await import('../data/projects-data');
  const fallbackProjects = await getProjects();
  return { projects: fallbackProjects, source: 'fallback' as const };
}

export type ProjectSyncOptions = GitHubToProjectOptions;
