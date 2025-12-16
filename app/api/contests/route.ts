import { NextRequest, NextResponse } from 'next/server';
import { getUpcomingContests, getContestsByPlatform } from '@/lib/contestService';

export const dynamic = 'force-dynamic'; // Always fetch fresh data

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');

    let contests;
    if (platform) {
      contests = await getContestsByPlatform(platform);
    } else {
      contests = await getUpcomingContests();
    }

    return NextResponse.json(
      {
        success: true,
        data: contests,
        timestamp: new Date().toISOString(),
        count: contests.length
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        }
      }
    );
  } catch (error) {
    console.error('[API/contests] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contests',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}