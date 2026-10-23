import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Bell, CalendarDays } from "lucide-react";
import {
  PLATFORM_META,
  formatDuration,
  formatISTDate,
  formatISTTime,
  getContestStatus,
  getGoogleCalendarUrl,
  type PlatformKey,
} from "@/lib/contestService";
import { getUpcomingContests } from "@/lib/contestSchedule";
import Countdown from "@/app/components/Countdown";
import FavoriteButton from "@/app/components/FavoriteButton";
import { contestKey } from "@/lib/favorites";

export const revalidate = 300;

async function findContest(platform: string, id: string) {
  const contests = await getUpcomingContests();
  return contests.find(
    (contest) => contest.platformKey === platform && String(contest.id) === String(id)
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string; id: string }>;
}): Promise<Metadata> {
  const { platform, id } = await params;
  const contest = await findContest(platform, id);

  if (!contest) return { title: "Contest not found - ContestRadar" };

  return {
    title: `${contest.name} (${contest.platform}) - ContestRadar`,
    description: `${contest.name} starts ${formatISTDate(contest.startTime)} at ${formatISTTime(
      contest.startTime
    )} IST. ${contest.platform}, ${formatDuration(contest.duration)}.`,
    openGraph: {
      title: `${contest.name} (${contest.platform})`,
      description: `${formatISTDate(contest.startTime)} · ${formatISTTime(
        contest.startTime
      )} IST · ${formatDuration(contest.duration)}`,
      type: "website",
    },
  };
}

export default async function ContestDetailPage({
  params,
}: {
  params: Promise<{ platform: string; id: string }>;
}) {
  const { platform, id } = await params;
  const contest = await findContest(platform, id);

  if (!contest) notFound();

  const platformKey = contest.platformKey as PlatformKey;
  const status = getContestStatus(contest.startTime, contest.endTime);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: contest.name,
    startDate: contest.startTime,
    endDate: contest.endTime,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    description: contest.description ?? `${contest.platform} contest`,
    url: contest.url,
    organizer: {
      "@type": "Organization",
      name: contest.platform,
      url: PLATFORM_META[platformKey].url,
    },
    location: {
      "@type": "VirtualLocation",
      url: contest.url,
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-line">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/contests"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to schedule
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2" data-platform={platformKey}>
            <span className="chip">
              <span className="platform-dot" aria-hidden="true" />
              {contest.platform}
            </span>
            <span className="chip">{contest.type}</span>
            {contest.difficulty && <span className="chip">{contest.difficulty}</span>}
            {status === "live" && <span className="status-live mono text-[10px]">LIVE</span>}
          </div>

          <h1 className="display mt-4 max-w-4xl text-3xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
            {contest.name}
          </h1>
        </div>
      </section>

      <div className="grid gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div>
          <div className="grid grid-cols-2 gap-4 border-y border-line py-5 sm:grid-cols-4">
            <Meta label="Date" value={formatISTDate(contest.startTime)} />
            <Meta label="Start" value={`${formatISTTime(contest.startTime)} IST`} />
            <Meta label="Duration" value={formatDuration(contest.duration)} />
            <Meta label="Status" value={status} />
          </div>

          <div className="mt-6">
            <p className="eyebrow">Starts in</p>
            <Countdown
              startTime={contest.startTime}
              className="mono mt-1 block text-4xl font-medium tabular-nums text-signal"
            />
          </div>

          {contest.description && (
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
              {contest.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-2">
            <a href={contest.url} target="_blank" rel="noopener noreferrer" className="btn btn-signal">
              Open contest
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={getGoogleCalendarUrl(contest)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Add to calendar
            </a>
            <Link href="/alerts" className="btn btn-outline">
              <Bell className="h-4 w-4" aria-hidden="true" />
              Set a reminder
            </Link>
          </div>
        </div>

        <aside className="panel h-fit p-5">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Contest actions</p>
            <FavoriteButton contestKey={contestKey(contest)} />
          </div>
          <dl className="mt-4 divide-y divide-line border-y border-line">
            <DetailRow label="Platform" value={contest.platform} />
            <DetailRow label="Type" value={contest.type} />
            <DetailRow label="Duration" value={formatDuration(contest.duration)} />
            {contest.participants ? (
              <DetailRow label="Expected" value={`~${contest.participants.toLocaleString()}`} />
            ) : null}
          </dl>
          <a
            href={PLATFORM_META[platformKey].url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-signal"
          >
            More on {contest.platform}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </aside>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-[13px] font-medium capitalize">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="eyebrow">{label}</dt>
      <dd className="text-[13px] font-medium">{value}</dd>
    </div>
  );
}
