import Link from "next/link";
import { ArrowUpRight, Bell, CalendarDays } from "lucide-react";
import type { Contest } from "@/lib/contestService";
import {
  formatDate,
  formatDuration,
  formatTime,
  getContestStatus,
  getGoogleCalendarUrl,
} from "@/lib/contestService";
import Countdown from "./Countdown";
import FavoriteButton from "./FavoriteButton";
import { contestKey } from "@/lib/favorites";

export default function ContestCard({
  contest,
  timeZone,
  className = "",
}: {
  contest: Contest;
  timeZone: string;
  className?: string;
}) {
  const status = getContestStatus(contest.startTime, contest.endTime);

  return (
    <article
      data-platform={contest.platformKey}
      className={`panel panel-hover group relative flex h-full flex-col overflow-hidden p-5 ${className}`}
    >
      <span className="platform-bar absolute inset-x-0 top-0" aria-hidden="true" />

      <div className="flex items-start justify-between gap-3">
        <span className="flex items-center gap-2">
          <span className="platform-dot" aria-hidden="true" />
          <span className="mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {contest.platform}
          </span>
        </span>
        <div className="flex items-center gap-2">
          {status === "live" && <span className="status-live mono text-[10px]">LIVE</span>}
          <span className="chip">{contest.type}</span>
        </div>
      </div>

      <h3 className="display mt-4 text-[1.35rem] font-bold leading-[1.05] tracking-tight transition-colors group-hover:text-signal">
        {contest.name}
      </h3>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDate(contest.startTime, timeZone)} · {formatTime(contest.startTime, timeZone)}
        </span>
        <span className="h-1 w-1 rounded-full bg-line" aria-hidden="true" />
        <span>{formatDuration(contest.duration)}</span>
        {contest.difficulty && (
          <>
            <span className="h-1 w-1 rounded-full bg-line" aria-hidden="true" />
            <span>{contest.difficulty}</span>
          </>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
        <div>
          <p className="eyebrow">{status === "live" ? "Ends in" : "Starts in"}</p>
          <Countdown
            startTime={status === "live" ? contest.endTime : contest.startTime}
            className="mono mt-1 block text-xl font-semibold tabular-nums tracking-tight text-signal"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FavoriteButton contestKey={contestKey(contest)} />
          <a
            href={getGoogleCalendarUrl(contest)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Add ${contest.name} to Google Calendar`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-signal/60 hover:text-foreground"
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
          </a>
          <Link
            href="/alerts"
            aria-label={`Set a reminder for ${contest.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-signal/60 hover:text-foreground"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a href={contest.url} target="_blank" rel="noopener noreferrer" className="btn btn-signal btn-sm">
            Enter
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
