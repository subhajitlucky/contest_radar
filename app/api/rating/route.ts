import { NextRequest, NextResponse } from "next/server";

interface CodeforcesUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  avatar?: string;
  country?: string;
  organization?: string;
  contribution?: number;
  friendOfCount?: number;
  registrationTimeSeconds?: number;
}

interface CodeforcesRatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get("handle")?.trim() ?? "";

  if (!/^[A-Za-z0-9_.-]{1,32}$/.test(handle)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid Codeforces handle." },
      { status: 400 }
    );
  }

  try {
    const [infoResponse, ratingResponse] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`, {
        next: { revalidate: 300 },
        headers: { "User-Agent": "ContestRadar/1.0" },
      }),
      fetch(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`, {
        next: { revalidate: 300 },
        headers: { "User-Agent": "ContestRadar/1.0" },
      }),
    ]);

    if (!infoResponse.ok) {
      return NextResponse.json(
        { ok: false, error: "Codeforces handle not found." },
        { status: 404 }
      );
    }

    const info = await infoResponse.json();
    const rating = await ratingResponse.json();

    if (info.status !== "OK" || !info.result?.[0]) {
      return NextResponse.json(
        { ok: false, error: "Codeforces handle not found." },
        { status: 404 }
      );
    }

    const profile = info.result[0] as CodeforcesUser;
    const history = (rating.status === "OK" ? rating.result : []) as CodeforcesRatingChange[];

    const bestRank = history.length > 0 ? Math.min(...history.map((item) => item.rank)) : null;
    const maxDelta =
      history.length > 0
        ? Math.max(...history.map((item) => item.newRating - item.oldRating))
        : null;

    return NextResponse.json(
      {
        ok: true,
        profile: {
          handle: profile.handle,
          rating: profile.rating ?? null,
          maxRating: profile.maxRating ?? null,
          rank: profile.rank ?? "unrated",
          maxRank: profile.maxRank ?? "unrated",
          avatar: profile.avatar ?? null,
          country: profile.country ?? null,
          organization: profile.organization ?? null,
          contribution: profile.contribution ?? 0,
          friends: profile.friendOfCount ?? 0,
        },
        stats: {
          contests: history.length,
          bestRank,
          maxDelta,
        },
        history: history.slice(-30).map((item) => ({
          contestId: item.contestId,
          contestName: item.contestName,
          rank: item.rank,
          timestamp: item.ratingUpdateTimeSeconds,
          oldRating: item.oldRating,
          newRating: item.newRating,
          delta: item.newRating - item.oldRating,
        })),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[api/rating] failed:", error);
    return NextResponse.json(
      { ok: false, error: "Could not reach Codeforces. Try again shortly." },
      { status: 502 }
    );
  }
}
