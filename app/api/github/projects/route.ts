import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/data/projects-data';

export const revalidate = 3600;

export async function GET() {
  const projects = await getProjects();

  return NextResponse.json(
    { projects, source: 'github' },
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
