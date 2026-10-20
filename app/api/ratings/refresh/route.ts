import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

interface CodeforcesRatingChange {
  contestId: number;
  contestName: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not configured" },
      { status: 503 }
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Database is not configured" },
      { status: 503 }
    );
  }

  const pool = getPool();
  const users = await pool.query<{ id: string; cf_handle: string }>(
    `SELECT id, cf_handle
     FROM users
     WHERE cf_handle IS NOT NULL
     ORDER BY cf_synced_at NULLS FIRST
     LIMIT 25`
  );

  let refreshed = 0;
  let failed = 0;

  for (const user of users.rows) {
    try {
      const [infoResponse, ratingResponse] = await Promise.all([
        fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(user.cf_handle)}`, {
          headers: { "User-Agent": "ContestRadar/1.0" },
        }),
        fetch(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(user.cf_handle)}`, {
          headers: { "User-Agent": "ContestRadar/1.0" },
        }),
      ]);

      if (!infoResponse.ok) throw new Error(`info ${infoResponse.status}`);

      const info = await infoResponse.json();
      const rating = await ratingResponse.json();
      const profile = info.result?.[0] as { rating?: number } | undefined;
      const history = (rating.status === "OK" ? rating.result : []) as CodeforcesRatingChange[];

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(
          "UPDATE users SET cf_rating = $1, cf_synced_at = NOW() WHERE id = $2",
          [profile?.rating ?? null, user.id]
        );

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

      refreshed += 1;
    } catch (error) {
      failed += 1;
      await pool.query("UPDATE users SET cf_synced_at = NOW() WHERE id = $1", [user.id]);
      console.error(`[ratings/refresh] ${user.cf_handle}:`, error);
    }
  }

  return NextResponse.json({
    ok: true,
    refreshed,
    failed,
    candidates: users.rowCount,
  });
}
