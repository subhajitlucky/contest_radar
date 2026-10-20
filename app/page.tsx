import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bell, CalendarDays } from "lucide-react";
import {
  PLATFORM_META,
  formatDuration,
  formatISTDate,
  formatISTTime,
  getContestStats,
  getUpcomingContests,
  istDayKey,
  type Contest,
  type PlatformKey,
} from "@/lib/contestService";
import Countdown from "./components/Countdown";
import NextContestPanel from "./components/NextContestPanel";

export const revalidate = 300;

const PLATFORM_KEYS = Object.keys(PLATFORM_META) as PlatformKey[];

function nowMs() {
  return Date.now();
}

export default async function Home() {
  const [contests, stats] = await Promise.all([getUpcomingContests(), getContestStats()]);
  const now = nowMs();
  const next24h = new Date(now + 24 * 60 * 60 * 1000).getTime();
  const weekEnd = new Date(now + 7 * 24 * 60 * 60 * 1000).getTime();

  const next =
    contests.find((contest) => !/weekday|beta|trial|practice/i.test(contest.name)) ?? contests[0];
  const next24 = contests.filter((contest) => {
    const start = new Date(contest.startTime).getTime();
    return start > now && start <= next24h;
  });
  const week = contests.filter((contest) => new Date(contest.startTime).getTime() <= weekEnd);

  const dayGroups = new Map<string, Contest[]>();
  for (const contest of week) {
    const key = istDayKey(contest.startTime);
    const list = dayGroups.get(key) ?? [];
    list.push(contest);
    dayGroups.set(key, list);
  }

  return (
    <div>
      <header className="border-b border-line">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Overview · {stats.upcoming} upcoming</p>
              <h1 className="display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                The field, at a glance.
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Live across five platforms. All times shown in IST.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/alerts" className="btn btn-signal">
                <Bell className="h-4 w-4" aria-hidden="true" />
                Set up alerts
              </Link>
              <Link href="/contests" className="btn btn-outline">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Full schedule
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          {next ? (
            <NextContestPanel contest={next} />
          ) : (
            <div className="panel p-6">
              <p className="eyebrow">Quiet window</p>
              <p className="display mt-3 text-2xl font-semibold">No upcoming contests found.</p>
              <p className="mt-2 text-sm text-muted">Sources refresh every five minutes.</p>
            </div>
          )}

          <section className="panel p-5" aria-label="Next 24 hours">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Next 24 hours</p>
              <span className="mono text-[11px] text-muted">{next24.length}</span>
            </div>

            {next24.length > 0 ? (
              <div className="mt-3 divide-y divide-line">
                {next24.slice(0, 4).map((contest) => (
                  <Link
                    key={`${contest.platformKey}-${contest.id}`}
                    href={`/contests?highlight=${contest.platformKey}:${contest.id}`}
                    data-platform={contest.platformKey}
                    className="group flex items-center gap-3 py-3"
                  >
                    <span className="mono w-16 shrink-0 whitespace-nowrap text-[11px] tabular-nums text-muted">
                      {formatISTTime(contest.startTime)}
                    </span>
                    <span className="platform-dot" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium group-hover:text-signal">
                        {contest.name}
                      </span>
                      <span className="mono block text-[10px] uppercase tracking-wider text-muted">
                        {contest.platform} · {formatDuration(contest.duration)}
                      </span>
                    </span>
                    <Countdown
                      startTime={contest.startTime}
                      className="mono shrink-0 text-[10px] tabular-nums text-signal"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 border-t border-line pt-5">
                <p className="text-sm text-muted">No contests in the next 24 hours.</p>
                <Link
                  href="/contests"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-signal"
                >
                  Look further out
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            )}

            <div className="mt-4 border-t border-line pt-3">
              <Link
                href="/alerts"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted transition-colors hover:text-ink"
              >
                Set alerts for these rounds
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>

        <section className="mt-10" aria-label="This week">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
            <div>
              <p className="eyebrow">This week</p>
              <h2 className="display mt-2 text-2xl font-semibold tracking-tight">
                Agenda · next seven days
              </h2>
            </div>
            <Link href="/contests" className="btn btn-ghost btn-sm">
              Open schedule
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="divide-y divide-line">
            {[...dayGroups.entries()].map(([day, items]) => (
              <div key={day} className="grid gap-3 py-5 sm:grid-cols-[120px_1fr] sm:gap-6">
                <div>
                  <p className="mono text-[11px] font-medium uppercase tracking-wider text-ink">
                    {formatISTDate(items[0].startTime)}
                  </p>
                  <p className="mono mt-1 text-[10px] uppercase tracking-wider text-muted">
                    {items.length} round{items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="space-y-1">
                  {items.map((contest) => (
                    <Link
                      key={`${contest.platformKey}-${contest.id}`}
                      href={`/contests?highlight=${contest.platformKey}:${contest.id}`}
                      data-platform={contest.platformKey}
                      className="group grid grid-cols-[64px_14px_1fr_auto] items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-panel"
                    >
                      <span className="mono whitespace-nowrap text-[11px] tabular-nums text-muted">
                        {formatISTTime(contest.startTime)}
                      </span>
                      <span className="platform-dot" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium group-hover:text-signal">
                          {contest.name}
                        </span>
                        <span className="mono block text-[10px] uppercase tracking-wider text-muted">
                          {PLATFORM_META[contest.platformKey].name} · {contest.type}
                        </span>
                      </span>
                      <Countdown
                        startTime={contest.startTime}
                        className="mono text-[10px] tabular-nums text-muted"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {dayGroups.size === 0 && (
              <div className="py-10 text-sm text-muted">
                No contests announced for the next seven days.
              </div>
            )}
          </div>
        </section>

        <section className="mt-10" aria-label="Platform pulse">
          <div className="border-b border-line pb-3">
            <p className="eyebrow">Platform pulse</p>
            <h2 className="display mt-2 text-2xl font-semibold tracking-tight">
              Every judge, one table
            </h2>
          </div>

          <div className="divide-y divide-line">
            {PLATFORM_KEYS.map((key) => {
              const platformContests = contests.filter((contest) => contest.platformKey === key);
              const platformNext = platformContests[0];
              return (
                <Link
                  key={key}
                  href={`/contests?platform=${key}`}
                  data-platform={key}
                  className="group flex flex-wrap items-center gap-3 py-3.5 transition-colors hover:bg-panel"
                >
                  <span className="platform-dot" aria-hidden="true" />
                  <span className="w-28 shrink-0 text-[13px] font-medium">
                    {PLATFORM_META[key].name}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-muted">
                    {platformNext ? platformNext.name : "No upcoming round"}
                  </span>
                  <span className="mono text-[10px] uppercase tracking-wider text-muted">
                    {platformContests.length} tracked
                  </span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-ink"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-sm text-muted">
            Free alerts for every platform. No paywall, no sponsored rankings.
          </p>
          <div className="flex gap-2">
            <Link href="/alerts" className="btn btn-outline btn-sm">
              <Bell className="h-3.5 w-3.5" aria-hidden="true" />
              Alerts
            </Link>
            <a href="/api/calendar.ics" className="btn btn-ghost btn-sm">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              .ics feed
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
