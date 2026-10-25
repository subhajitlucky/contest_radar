import Link from "next/link";
import { ArrowUpRight, Radio } from "lucide-react";
import { PLATFORM_META, type PlatformKey } from "@/lib/contestService";
import { getContestStats, getUpcomingContests } from "@/lib/contestSchedule";
import { getTimeZone } from "@/lib/timezoneServer";
import ContestsExplorer from "@/app/components/ContestsExplorer";

export default async function ContestsPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; q?: string; highlight?: string }>;
}) {
  const params = await searchParams;
  const initialPlatform =
    params.platform && params.platform in PLATFORM_META
      ? (params.platform as PlatformKey)
      : "all";
  const [contests, stats, timeZone] = await Promise.all([
    getUpcomingContests(),
    getContestStats(),
    getTimeZone(),
  ]);

  return (
    <div>
      <section className="border-b border-line">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
                Live schedule
              </p>
              <h1 className="display mt-4 max-w-3xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
                The schedule, <span className="serif-accent">decoded</span>.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
                Every upcoming round from five platforms, normalized into one calm list.
                Search it, filter it, or send it straight to your calendar.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/alerts" className="btn btn-signal">
                Get alerts
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href="/api/calendar.ics" className="btn btn-outline">
                Subscribe .ics
              </a>
            </div>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 border-t border-line/70 pt-5 sm:grid-cols-4">
            <Stat value={String(stats.upcoming)} label="Upcoming" />
            <Stat value={String(stats.active)} label="Live now" />
            <Stat value={String(stats.next24h)} label="Next 24h" />
            <Stat value={String(stats.platforms.length)} label="Platforms" />
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <ContestsExplorer
          contests={contests}
          initialPlatform={initialPlatform}
          initialQuery={typeof params.q === "string" ? params.q : ""}
          initialHighlight={typeof params.highlight === "string" ? params.highlight : undefined}
          timeZone={timeZone}
        />
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="display text-3xl font-bold tracking-tight">{value}</p>
      <p className="mono mt-1 text-[10px] uppercase tracking-[0.16em] text-muted">{label}</p>
    </div>
  );
}
