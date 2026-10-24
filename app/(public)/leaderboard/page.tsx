import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Trophy } from "lucide-react";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { getWeekStreaks } from "@/lib/streak";

export const metadata: Metadata = {
  title: "Leaderboard - ContestRadar",
  description:
    "Opt-in Codeforces rating and weekly contest streak leaderboard for ContestRadar accounts.",
};

export const dynamic = "force-dynamic";

interface LeaderRow {
  id: string;
  cf_handle: string;
  cf_rating: number;
}

export default async function LeaderboardPage() {
  let rows: Array<LeaderRow & { contests: number; streak: number }> = [];

  if (isDatabaseConfigured()) {
    const pool = getPool();
    const users = await pool.query<LeaderRow>(
      `SELECT id, cf_handle, cf_rating
       FROM users
       WHERE leaderboard_opt_in = TRUE AND cf_handle IS NOT NULL AND cf_rating IS NOT NULL
       ORDER BY cf_rating DESC
       LIMIT 25`
    );

    if (users.rows.length > 0) {
      const ids = users.rows.map((row) => row.id);
      const history = await pool.query<{ user_id: string; timestamp: string | number }>(
        `SELECT user_id, timestamp FROM user_contest_history WHERE user_id = ANY($1::bigint[])`,
        [ids]
      );

      const byUser = new Map<string, number[]>();
      for (const item of history.rows) {
        const list = byUser.get(String(item.user_id)) ?? [];
        list.push(Number(item.timestamp));
        byUser.set(String(item.user_id), list);
      }

      rows = users.rows.map((row) => {
        const timestamps = byUser.get(String(row.id)) ?? [];
        return {
          ...row,
          contests: timestamps.length,
          streak: getWeekStreaks(timestamps).current,
        };
      });
    }
  }

  return (
    <div>
      <section className="border-b border-line">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <p className="eyebrow flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            Leaderboard
          </p>
          <h1 className="display mt-4 max-w-3xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
            Consistent beats <span className="serif-accent">lucky</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Opt-in only. Ranked by current Codeforces rating, with stored contest count and
            weekly streak.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        {rows.length === 0 ? (
          <div className="panel flex flex-col items-center gap-3 px-6 py-16 text-center">
            <Trophy className="h-6 w-6 text-muted" aria-hidden="true" />
            <p className="text-sm font-medium">No one has joined yet.</p>
            <p className="max-w-md text-xs text-muted">
              Link a Codeforces handle and opt in from your profile. Only your handle,
              rating, contest count, and streak are shown.
            </p>
            <Link href="/login" className="btn btn-signal btn-sm">
              Sign in to join
            </Link>
          </div>
        ) : (
          <div className="panel overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_80px_80px_80px] gap-2 border-b border-line px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-muted sm:grid-cols-[50px_1fr_100px_100px_100px] sm:px-5">
              <span>#</span>
              <span>Handle</span>
              <span className="text-right">Rating</span>
              <span className="text-right">Contests</span>
              <span className="text-right">Streak</span>
            </div>
            <div className="divide-y divide-line">
              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[40px_1fr_80px_80px_80px] items-center gap-2 px-4 py-3 text-[13px] sm:grid-cols-[50px_1fr_100px_100px_100px] sm:px-5"
                >
                  <span className="mono text-[11px] text-muted">{index + 1}</span>
                  <a
                    href={`https://codeforces.com/profile/${row.cf_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-w-0 items-center gap-1 font-medium hover:text-signal"
                  >
                    <span className="truncate">{row.cf_handle}</span>
                    <ArrowUpRight className="h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
                  </a>
                  <span className="mono text-right text-[11px] tabular-nums">{row.cf_rating}</span>
                  <span className="mono text-right text-[11px] tabular-nums text-muted">
                    {row.contests}
                  </span>
                  <span className="mono text-right text-[11px] tabular-nums text-signal">
                    {row.streak}w
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-4 text-[10px] text-muted">
          Rating history is stored when you link a handle. Streaks count consecutive ISO
          weeks with at least one rated contest.
        </p>
      </section>
    </div>
  );
}
