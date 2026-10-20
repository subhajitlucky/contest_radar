import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getWeekStreaks } from "@/lib/streak";

export const dynamic = "force-dynamic";

interface CodeforcesRatingChange {
  contestId: number;
  contestName: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Accounts are not configured." }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in first." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const handle = typeof (body as { handle?: unknown }).handle === "string"
    ? (body as { handle: string }).handle.trim()
    : "";

  if (!/^[A-Za-z0-9_.-]{1,32}$/.test(handle)) {
    return NextResponse.json({ ok: false, error: "Enter a valid Codeforces handle." }, { status: 400 });
  }

  try {
    const [infoResponse, ratingResponse] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`, {
        headers: { "User-Agent": "ContestRadar/1.0" },
      }),
      fetch(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`, {
        headers: { "User-Agent": "ContestRadar/1.0" },
      }),
    ]);

    if (!infoResponse.ok) {
      return NextResponse.json({ ok: false, error: "Codeforces handle not found." }, { status: 404 });
    }

    const info = await infoResponse.json();
    if (info.status !== "OK" || !info.result?.[0]) {
      return NextResponse.json({ ok: false, error: "Codeforces handle not found." }, { status: 404 });
    }

    const profile = info.result[0] as { handle: string; rating?: number };
    const rating = await ratingResponse.json();
    const history = (rating.status === "OK" ? rating.result : []) as CodeforcesRatingChange[];

    const client = await getPool().connect();
    try {
      await client.query("BEGIN");
      await client.query(
        "UPDATE users SET cf_handle = $1, cf_rating = $2 WHERE id = $3",
        [profile.handle, profile.rating ?? null, user.id]
      );
      await client.query("DELETE FROM user_contest_history WHERE user_id = $1", [user.id]);

      for (const item of history) {
        await client.query(
          `INSERT INTO user_contest_history
             (user_id, contest_id, contest_name, rank, old_rating, new_rating, timestamp)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (user_id, contest_id) DO UPDATE SET
             contest_name = EXCLUDED.contest_name,
             rank = EXCLUDED.rank,
             old_rating = EXCLUDED.old_rating,
             new_rating = EXCLUDED.new_rating,
             timestamp = EXCLUDED.timestamp`,
          [
            user.id,
            item.contestId,
            item.contestName,
            item.rank,
            item.oldRating,
            item.newRating,
            item.ratingUpdateTimeSeconds,
          ]
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    return NextResponse.json({
      ok: true,
      handle: profile.handle,
      rating: profile.rating ?? null,
      contests: history.length,
      streak: getWeekStreaks(history.map((item) => item.ratingUpdateTimeSeconds)),
    });
  } catch (error) {
    console.error("[user/codeforces] failed:", error);
    return NextResponse.json(
      { ok: false, error: "Could not fetch that Codeforces profile." },
      { status: 502 }
    );
  }
}
