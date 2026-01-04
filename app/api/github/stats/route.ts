import { NextRequest, NextResponse } from 'next/server';
import { githubAPI } from '@/lib/github-api';

// Enable caching for 5 minutes
export const revalidate = 300;

// Simple in-memory rate limiter
// For production, consider using Redis or a dedicated rate limiting service
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(t => now - t < this.windowMs);
      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    }
  }

  check(identifier: string): { allowed: boolean; resetIn?: number } {
    const now = Date.now();
    const timestamps = this.requests.get(identifier) || [];

    // Filter out old timestamps
    const validTimestamps = timestamps.filter(t => now - t < this.windowMs);

    if (validTimestamps.length >= this.maxRequests) {
      // Find when the oldest request will expire
      const oldestTimestamp = validTimestamps[0];
      const resetIn = Math.ceil((oldestTimestamp + this.windowMs - now) / 1000);
      return { allowed: false, resetIn };
    }

    // Add new timestamp
    validTimestamps.push(now);
    this.requests.set(identifier, validTimestamps);

    return { allowed: true };
  }
}

// Create rate limiter instance: 10 requests per minute per IP
const rateLimiter = new RateLimiter(10, 60000);

function getClientIp(request: NextRequest): string {
  // Check various headers for the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return 'unknown';
}

export async function GET(request: NextRequest) {
  // Rate limiting check
  const clientIp = getClientIp(request);
  const rateLimitCheck = rateLimiter.check(clientIp);

  if (!rateLimitCheck.allowed) {
    return NextResponse.json(
      {
        totalRepos: 0,
        totalStars: 0,
        totalForks: 0,
        totalCommits: 0,
        topLanguages: [],
        contributions: 0,
        isLoading: false,
        error: 'Rate limit exceeded. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': rateLimitCheck.resetIn?.toString() || '60',
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitCheck.resetIn?.toString() || '60',
        },
      }
    );
  }
  try {
    // Fetch stats using the GitHub API service
    const stats = await githubAPI.getGitHubStats();

    // Get remaining requests count for headers
    const remaining = Math.max(0, 10 - (rateLimiter.check(clientIp).allowed ? 1 : 0));

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': '60',
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
