import { NextResponse } from 'next/server';
import { getContestStats } from '@/lib/contestService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getContestStats();

    return NextResponse.json(
      {
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        }
      }
    );
  } catch (error) {
    console.error('[API/stats] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stats',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}