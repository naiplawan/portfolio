import { NextRequest, NextResponse } from 'next/server';
import { fetchProjectsFromGitHub } from '@/lib/utils/github-sync';
import { FALLBACK_PROJECTS } from '@/lib/data/projects-data';

// Enable caching for 5 minutes
export const revalidate = 300;
export const dynamic = 'force-dynamic';

// GitHub username from environment variable
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'naiplawan';

export async function GET(_request: NextRequest) {
  try {
    // Fetch from GitHub API
    const githubProjects = await fetchProjectsFromGitHub(GITHUB_USERNAME, {
      includeForks: false,
      minStars: 0,
      sortBy: 'stars',
    });

    if (githubProjects.length > 0) {
      return NextResponse.json(
        { projects: githubProjects, source: 'github' },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      );
    }

    // Return fallback projects if GitHub returns empty
    return NextResponse.json(
      { projects: FALLBACK_PROJECTS, source: 'fallback' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('GitHub API error:', error);

    // Return fallback projects on error
    return NextResponse.json(
      { projects: FALLBACK_PROJECTS, source: 'fallback', error: 'Failed to fetch from GitHub, using fallback' },
      { status: 200 }
    );
  }
}
