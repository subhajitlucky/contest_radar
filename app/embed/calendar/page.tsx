import Link from "next/link";
import {
  PLATFORM_META,
  formatISTDate,
  formatISTTime,
  type PlatformKey,
} from "@/lib/contestService";
import { getUpcomingContests } from "@/lib/contestSchedule";

export const revalidate = 300;

export default async function EmbedCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; theme?: string }>;
}) {
  const params = await searchParams;
  const platform =
    params.platform && params.platform in PLATFORM_META
      ? (params.platform as PlatformKey)
      : null;
  const contests = (await getUpcomingContests())
    .filter((contest) => !platform || contest.platformKey === platform)
    .slice(0, 8);
  const theme = params.theme === "light" ? "light" : undefined;

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-background p-4 text-foreground"
    >
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <p className="mono text-[9px] uppercase tracking-[0.16em] text-muted">
              ContestRadar
            </p>
            <h1 className="mt-1 text-base font-semibold tracking-tight">
              {platform ? PLATFORM_META[platform].name : "Upcoming contests"}
            </h1>
          </div>
          <Link
            href="/contests"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-semibold text-signal"
          >
            Full schedule ↗
          </Link>
        </div>

        {contests.length > 0 ? (
          <div className="divide-y divide-line">
            {contests.map((contest) => (
              <a
                key={`${contest.platformKey}-${contest.id}`}
                href={contest.url}
                target="_blank"
                rel="noopener noreferrer"
                data-platform={contest.platformKey}
                className="flex items-center gap-3 py-2.5"
              >
                <span className="platform-dot" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-medium">{contest.name}</span>
                  <span className="mono block text-[9px] uppercase tracking-wider text-muted">
                    {formatISTDate(contest.startTime)} · {formatISTTime(contest.startTime)}
                  </span>
                </span>
                <span className="mono shrink-0 text-[9px] text-signal">
                  {contest.platform}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-xs text-muted">No upcoming contests.</p>
        )}

        <p className="mt-3 border-t border-line pt-2 text-[9px] text-muted">
          Times in IST · free forever · contestradar.vercel.app
        </p>
      </div>
    </div>
  );
}
