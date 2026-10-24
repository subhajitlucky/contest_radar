import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Radio, Trophy, UserRound } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { getWeekStreaks } from "@/lib/streak";
import LinkCodeforces from "./LinkCodeforces";
import LeaderboardOptIn from "./LeaderboardOptIn";
import RatingLookup from "./RatingLookup";
import SyncFavorites from "./SyncFavorites";

export const metadata: Metadata = {
  title: "Profile - ContestRadar",
  description:
    "Look up a Codeforces rating, contest history, and practice recommendations for the next round.",
};

export const dynamic = "force-dynamic";

interface AccountAlert {
  channel: string;
  destination: string;
  platforms: string[];
  lead_minutes: number;
}

interface AccountData {
  cfHandle: string | null;
  cfRating: number | null;
  optIn: boolean;
  streak: { current: number; longest: number };
  contests: number;
  alerts: AccountAlert[];
  pushCount: number;
}

const EMPTY_ACCOUNT: AccountData = {
  cfHandle: null,
  cfRating: null,
  optIn: false,
  streak: { current: 0, longest: 0 },
  contests: 0,
  alerts: [],
  pushCount: 0,
};

async function loadAccount(userId: string): Promise<AccountData> {
  if (!isDatabaseConfigured()) return EMPTY_ACCOUNT;

  const pool = getPool();
  const [userResult, alertsResult, pushResult, historyResult] = await Promise.all([
    pool.query<{ cf_handle: string | null; cf_rating: number | null; leaderboard_opt_in: boolean }>(
      "SELECT cf_handle, cf_rating, leaderboard_opt_in FROM users WHERE id = $1",
      [userId]
    ),
    pool.query<AccountAlert>(
      `SELECT channel, destination, platforms, lead_minutes
       FROM alert_subscriptions
       WHERE user_id = $1 AND confirmed = TRUE
       ORDER BY created_at`,
      [userId]
    ),
    pool.query<{ count: number }>(
      "SELECT COUNT(*)::int AS count FROM push_subscriptions WHERE user_id = $1",
      [userId]
    ),
    pool.query<{ timestamp: string | number }>(
      "SELECT timestamp FROM user_contest_history WHERE user_id = $1",
      [userId]
    ),
  ]);

  const row = userResult.rows[0];
  const timestamps = historyResult.rows.map((item) => Number(item.timestamp));

  return {
    cfHandle: row?.cf_handle ?? null,
    cfRating: row?.cf_rating ?? null,
    optIn: row?.leaderboard_opt_in ?? false,
    streak: getWeekStreaks(timestamps),
    contests: timestamps.length,
    alerts: alertsResult.rows,
    pushCount: pushResult.rows[0]?.count ?? 0,
  };
}

function maskDestination(channel: string, destination: string): string {
  if (channel === "discord") return "Discord webhook";
  if (channel === "telegram") return "Telegram chat";
  if (destination.includes("@")) {
    const [name, domain] = destination.split("@");
    return `${name.slice(0, 2)}***@${domain}`;
  }
  return "Saved destination";
}

export default async function ProfilePage() {
  const user = await getSessionUser();
  const account = user ? await loadAccount(user.id) : EMPTY_ACCOUNT;
  const alertsCount = account.alerts.length + account.pushCount;

  return (
    <div>
      <section className="border-b border-line">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <p className="eyebrow flex items-center gap-2">
            <UserRound className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            Profile
          </p>
          <h1 className="display mt-4 max-w-3xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
            Your contest <span className="serif-accent">signal</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Look up a Codeforces handle to see rating history, recent rounds, and what to
            practice next.
          </p>
        </div>
      </section>

      <section className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="panel flex flex-wrap items-center justify-between gap-3 p-4">
          {user ? (
            <>
              <div>
                <p className="eyebrow">Signed in</p>
                <p className="mt-1 text-sm font-medium">{user.email}</p>
              </div>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="btn btn-outline btn-sm">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <div>
                <p className="eyebrow">Account</p>
                <p className="mt-1 text-sm text-muted">
                  Sign in to sync favorites, alerts, and contest history.
                </p>
              </div>
              <Link href="/login" className="btn btn-signal btn-sm">
                Sign in
              </Link>
            </>
          )}
        </div>
      </section>

      {user && (
        <section className="grid gap-4 px-4 pt-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Account summary</p>
              <Link href="/leaderboard" className="inline-flex items-center gap-1 text-[10px] font-semibold text-signal">
                <Trophy className="h-3 w-3" aria-hidden="true" />
                Leaderboard
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4">
              <Stat label="Codeforces rating" value={account.cfRating?.toString() ?? "—"} />
              <Stat label="Contest streak" value={`${account.streak.current}w`} />
              <Stat label="Stored contests" value={String(account.contests)} />
              <Stat label="Active alerts" value={String(alertsCount)} />
            </div>
          </div>

          <div className="space-y-4">
            <LinkCodeforces initialHandle={account.cfHandle} initialRating={account.cfRating} />
            <LeaderboardOptIn initialOptIn={account.optIn} hasHandle={Boolean(account.cfHandle)} />
          </div>
        </section>
      )}

      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <SyncFavorites loggedIn={Boolean(user)} />
      </section>

      {user && account.alerts.length + account.pushCount > 0 && (
        <section className="px-4 pb-4 sm:px-6 lg:px-8">
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-signal" aria-hidden="true" />
                <h2 className="text-sm font-semibold">Your alerts</h2>
              </div>
              <Link href="/alerts" className="text-[10px] font-semibold text-muted hover:text-ink">
                Manage
              </Link>
            </div>
            <div className="divide-y divide-line">
              {account.alerts.map((alert, index) => (
                <div key={`${alert.channel}-${index}`} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <span className="mono w-20 shrink-0 text-[10px] uppercase tracking-wider text-muted">
                    {alert.channel}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px]">
                    {maskDestination(alert.channel, alert.destination)}
                  </span>
                  <span className="mono text-[10px] uppercase tracking-wider text-muted">
                    {alert.lead_minutes}m ·{" "}
                    {alert.platforms.length > 0 ? alert.platforms.join(", ") : "all platforms"}
                  </span>
                </div>
              ))}
              {account.pushCount > 0 && (
                <div className="flex items-center gap-3 px-5 py-3">
                  <span className="mono w-20 shrink-0 text-[10px] uppercase tracking-wider text-muted">
                    push
                  </span>
                  <span className="flex-1 text-[13px]">
                    {account.pushCount} browser subscription{account.pushCount === 1 ? "" : "s"}
                  </span>
                  <Radio className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 pb-8 sm:px-6 lg:px-8">
        <RatingLookup />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
