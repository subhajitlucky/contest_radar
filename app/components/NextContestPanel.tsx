import Link from "next/link";
import { ArrowUpRight, Bell, CalendarDays } from "lucide-react";
import type { Contest } from "@/lib/contestService";
import {
  formatDuration,
  formatISTDate,
  formatISTTime,
  getGoogleCalendarUrl,
} from "@/lib/contestService";
import Countdown from "./Countdown";

export default function NextContestPanel({ contest }: { contest: Contest }) {
  return (
    <section className="panel p-6 sm:p-7" data-platform={contest.platformKey} aria-label="Next contest">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="platform-dot" aria-hidden="true" />
          <span className="eyebrow">Next up</span>
        </div>
        <span className="chip">{contest.type}</span>
      </div>

      <h2 className="display mt-5 max-w-2xl text-3xl font-semibold leading-[1.04] tracking-tight sm:text-4xl">
        {contest.name}
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-4">
        <Meta label="Date" value={formatISTDate(contest.startTime)} />
        <Meta label="Start" value={`${formatISTTime(contest.startTime)} IST`} />
        <Meta label="Duration" value={formatDuration(contest.duration)} />
        <Meta label="Platform" value={contest.platform} />
      </div>

      <div className="mt-7 flex flex-wrap items-end justify-between gap-5 border-t border-line pt-5">
        <div>
          <p className="eyebrow">T-minus</p>
          <Countdown
            startTime={contest.startTime}
            className="mono mt-1.5 block text-3xl font-medium tabular-nums tracking-tight text-signal sm:text-4xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={getGoogleCalendarUrl(contest)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            Calendar
          </a>
          <Link href="/alerts" className="btn btn-outline btn-sm">
            <Bell className="h-3.5 w-3.5" aria-hidden="true" />
            Remind me
          </Link>
          <a href={contest.url} target="_blank" rel="noopener noreferrer" className="btn btn-signal btn-sm">
            Open contest
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-[13px] font-medium">{value}</p>
    </div>
  );
}
