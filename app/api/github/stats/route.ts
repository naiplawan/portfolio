import { NextRequest, NextResponse } from 'next/server';
import { githubAPI } from '@/lib/github-api';

// Enable caching for 5 minutes
export const revalidate = 300;

export async function GET(request: NextRequest) {
  try {
    // Get GitHub username from env (server-side only, safe)
    const username = process.env.GITHUB_USERNAME || process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'naiplawan';

    // Fetch stats using the GitHub API service
    const stats = await githubAPI.getGitHubStats();

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('GitHub API error:', error);

    // Return appropriate error responses
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          {
            totalRepos: 0,
            totalStars: 0,
            totalForks: 0,
            totalCommits: 0,
            topLanguages: [],
            contributions: 0,
            isLoading: false,
            error: 'GitHub API rate limit exceeded. Please try again later.',
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          totalRepos: 0,
          totalStars: 0,
          totalForks: 0,
          totalCommits: 0,
          topLanguages: [],
          contributions: 0,
          isLoading: false,
          error: 'Failed to fetch GitHub statistics.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        totalRepos: 0,
        totalStars: 0,
        totalForks: 0,
        totalCommits: 0,
        topLanguages: [],
        contributions: 0,
        isLoading: false,
        error: 'An unexpected error occurred.',
      },
      { status: 500 }
    );
  }
}
