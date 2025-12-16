import { NextRequest, NextResponse } from 'next/server';
import { getContestById } from '@/lib/contestService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const contest = await getContestById(id);

    if (!contest) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contest not found',
          message: `No contest found with ID: ${id}`
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: contest,
        timestamp: new Date().toISOString()
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        }
      }
    );
  } catch (error) {
    console.error('[API/contests/[id]] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contest',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}