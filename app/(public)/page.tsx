import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Code2,
  Layers,
  type LucideIcon,
} from "lucide-react";
import Countdown from "@/app/components/Countdown";
import {
  PLATFORM_META,
  formatDate,
  formatDuration,
  formatTime,
  type PlatformKey,
} from "@/lib/contestService";
import { getContestStats, getUpcomingContests } from "@/lib/contestSchedule";
import { getTimeZone } from "@/lib/timezoneServer";
import { timeZoneLabel } from "@/lib/timezone";

const PLATFORM_KEYS = Object.keys(PLATFORM_META) as PlatformKey[];

const FEATURES: Array<{
  icon: LucideIcon;
  title: string;
  copy: string;
}> = [
  {
    icon: Layers,
    title: "One normalized schedule",
    copy: "Codeforces, LeetCode, CodeChef, AtCoder, and HackerRank in one calm list. No tab-hopping.",
  },
  {
    icon: Bell,
    title: "Alerts that arrive in time",
    copy: "Email, Telegram, Discord, and web push before the round starts. Set a lead time once.",
  },
  {
    icon: CalendarDays,
    title: "Calendar-native",
    copy: "Send any round to Google Calendar or subscribe to a live .ics feed for every platform.",
  },
  {
    icon: Code2,
    title: "Open by default",
    copy: "A free read-only API, embeddable calendar, and a browser extension. No API keys to browse.",
  },
];

const FAQ = [
  {
    question: "Is ContestRadar free?",
    answer:
      "Yes. Contest discovery, alerts, and calendar feeds stay free. Donations cover infrastructure only, never feature access.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. You can browse the schedule, filter platforms, and subscribe to calendar feeds without signing in. An account is only for syncing favorites, alerts, and profile data across devices.",
  },
  {
    question: "Which platforms are covered?",
    answer:
      "Codeforces, LeetCode, CodeChef, AtCoder, and HackerRank. Each source is normalized into the same contest shape and refreshed independently.",
  },
  {
    question: "How fresh is the schedule?",
    answer:
      "Sources refresh on a short cache, and the persisted schedule is refreshed every 15 minutes. If a source is temporarily down, the last-known schedule stays available.",
  },
  {
    question: "Can I export contests?",
    answer:
      "Yes. Every contest has a Google Calendar link, and every platform has an .ics feed you can subscribe to once.",
  },
];

function nowMs() {
  return Date.now();
}

export default async function PublicHomePage() {
  const [contests, stats, timeZone] = await Promise.all([
    getUpcomingContests(),
    getContestStats(),
    getTimeZone(),
  ]);
  const now = nowMs();
  const upcoming = contests.filter((contest) => new Date(contest.startTime).getTime() > now);
  const next = upcoming[0] ?? contests[0];
  const nextKey = next ? `${next.platformKey}:${next.id}` : null;
  const next24 = upcoming
    .filter((contest) => new Date(contest.startTime).getTime() <= now + 24 * 60 * 60 * 1000)
    .filter((contest) => `${contest.platformKey}:${contest.id}` !== nextKey)
    .slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="landing-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="relative grid items-start gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="eyebrow flex flex-wrap items-center gap-3">
              <span className="status-live">Live</span>
              <span>Five platforms · One schedule</span>
            </p>

            <h1 className="display mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Every contest.
              <br />
              <span className="serif-accent">One clear signal.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              A free, live schedule for competitive programmers. Five platforms, one
              normalized list, calendar feeds, and alerts that reach you before the round
              starts.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contests" className="btn btn-signal h-11 px-5 text-sm">
                Browse the schedule
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/alerts" className="btn btn-outline h-11 px-5 text-sm">
                <Bell className="h-4 w-4" aria-hidden="true" />
                Get alerts
              </Link>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-6">
              <Stat value="5" label="Platforms" />
              <Stat value={String(stats.totalContests)} label="Rounds tracked" />
              <Stat value="0" label="Paywalls" />
            </dl>
          </div>

          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="eyebrow">Next up</span>
              <span className="chip">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                Live data
              </span>
            </div>

            {next ? (
              <>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <span className="platform-dot" data-platform={next.platformKey} aria-hidden="true" />
                    <span className="mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {next.platform}
                    </span>
                  </div>
                  <h2 className="display mt-3 text-2xl font-semibold leading-tight">
                    {next.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    {formatDate(next.startTime, timeZone)} ·{" "}
                    {formatTime(next.startTime, timeZone)} {timeZoneLabel(timeZone)} ·{" "}
                    {formatDuration(next.duration)}
                  </p>

                  <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
                    <div>
                      <p className="eyebrow">Starts in</p>
                      <Countdown
                        startTime={next.startTime}
                        className="mono mt-1 block text-2xl font-semibold tabular-nums text-signal"
                      />
                    </div>
                    <Link
                      href={`/contests/${next.platformKey}/${next.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      View round
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                {next24.length > 0 && (
                  <div className="border-t border-line px-5 py-3">
                    <p className="eyebrow">Also in the next 24 hours</p>
                  </div>
                )}
                <div className="divide-y divide-line border-t border-line">
                  {next24.map((contest) => (
                    <Link
                      key={`${contest.platformKey}-${contest.id}`}
                      href={`/contests/${contest.platformKey}/${contest.id}`}
                      data-platform={contest.platformKey}
                      className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-panel-2"
                    >
                      <span className="platform-dot" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium">
                          {contest.name}
                        </span>
                        <span className="mono block text-[10px] uppercase tracking-wider text-muted">
                          {formatTime(contest.startTime, timeZone)} {timeZoneLabel(timeZone)}
                        </span>
                      </span>
                      <Countdown
                        startTime={contest.startTime}
                        className="mono shrink-0 text-[10px] tabular-nums text-muted"
                      />
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-6">
                <p className="display text-2xl font-semibold">Quiet window.</p>
                <p className="mt-2 text-sm text-muted">
                  No upcoming contests found right now. Sources refresh every few minutes.
                </p>
              </div>
            )}

            <div className="border-t border-line px-5 py-3">
              <Link
                href="/contests"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted transition-colors hover:text-ink"
              >
                See the full schedule
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line px-5 py-14 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Coverage</p>
            <h2 className="display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              One schedule. Five platforms.
            </h2>
          </div>
          <Link href="/contests" className="btn btn-ghost btn-sm">
            Open schedule
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PLATFORM_KEYS.map((key) => {
            const platformContests = contests.filter((contest) => contest.platformKey === key);
            const platformNext = platformContests[0];
            return (
              <Link
                key={key}
                href={`/contests?platform=${key}`}
                data-platform={key}
                className="panel panel-hover group min-w-0 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="platform-dot" aria-hidden="true" />
                  <span className="mono text-[10px] uppercase tracking-wider text-muted">
                    {platformContests.length} tracked
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold">{PLATFORM_META[key].name}</p>
                <p className="mt-1 truncate text-xs text-muted">
                  {platformNext ? platformNext.name : "No upcoming round"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-b border-line px-5 py-14 sm:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">The product</p>
          <h2 className="display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for the way you compete.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            Less checking, less guessing, less noise. ContestRadar keeps the logistics out
            of the way so you can spend your attention on the round.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="panel p-5">
                <Icon className="h-5 w-5 text-signal" aria-hidden="true" />
                <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-b border-line px-5 py-14 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              From open tab to ready.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              No setup required to browse. Add alerts when you want them, and keep the
              schedule in the tools you already use.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contests" className="btn btn-outline btn-sm">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                Explore contests
              </Link>
              <a href="/api/calendar.ics" className="btn btn-ghost btn-sm">
                Subscribe to .ics
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <ol className="space-y-3">
            <Step
              number="01"
              title="Open the radar"
              copy="See every upcoming round across five platforms in one normalized list."
            />
            <Step
              number="02"
              title="Filter to your field"
              copy="Pick the platforms you actually compete on, or search for a specific round."
            />
            <Step
              number="03"
              title="Get the reminder"
              copy="Choose email, Telegram, Discord, or web push. The schedule stays free."
            />
          </ol>
        </div>
      </section>

      <section className="border-b border-line px-5 py-14 sm:px-8">
        <div className="panel relative overflow-hidden p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="eyebrow">Free forever</p>
            <h2 className="display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Stop refreshing five tabs.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              One clear schedule, calendar-native exports, and reminders that arrive in
              time. No paywall on discovery, alerts, or feeds.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contests" className="btn btn-signal">
                Browse the schedule
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/login" className="btn btn-outline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Questions, answered.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Still curious? The developer docs cover the API, data sources, and cache
              behavior.
            </p>
            <Link href="/developers" className="btn btn-ghost btn-sm mt-5">
              Read the docs
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-3">
            {FAQ.map((item) => (
              <details key={item.question} className="faq-item panel p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                  {item.question}
                  <span className="faq-icon" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="display mt-1 text-2xl font-semibold tracking-tight">{value}</dd>
    </div>
  );
}

function Step({
  number,
  title,
  copy,
}: {
  number: string;
  title: string;
  copy: string;
}) {
  return (
    <li className="panel flex gap-4 p-5">
      <span className="mono text-[10px] font-semibold uppercase tracking-[0.14em] text-signal">
        {number}
      </span>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{copy}</p>
      </div>
    </li>
  );
}
