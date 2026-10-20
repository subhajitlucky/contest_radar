import Link from "next/link";
import { ArrowUpRight, CalendarDays, Radio, ShieldCheck } from "lucide-react";
import { PLATFORM_META, type PlatformKey } from "@/lib/contestService";

export const metadata = {
  title: "About - ContestRadar",
  description:
    "How ContestRadar normalizes five contest platforms into one free, real-time schedule.",
};

const PLATFORM_KEYS = Object.keys(PLATFORM_META) as PlatformKey[];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <p className="eyebrow flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            About
          </p>
          <h1 className="display mt-4 max-w-4xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
            One signal for the <span className="serif-accent">whole field</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            ContestRadar normalizes official and public platform data into one calm schedule.
            No accounts required to browse, no paywall on alerts, no sponsored rankings.
          </p>
        </div>
      </section>

      <section className="grid gap-4 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="panel p-6">
          <ShieldCheck className="h-5 w-5 text-signal" aria-hidden="true" />
          <h2 className="display mt-4 text-xl font-bold">Signal, not noise</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            We show the next round, the countdown, and the link. No infinite feed, no
            engagement bait, no dark patterns.
          </p>
        </div>
        <div className="panel p-6">
          <CalendarDays className="h-5 w-5 text-signal" aria-hidden="true" />
          <h2 className="display mt-4 text-xl font-bold">Calendar native</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Every contest can go to Google Calendar, and every platform has a live .ics feed
            you can subscribe to once.
          </p>
        </div>
        <div className="panel p-6">
          <Radio className="h-5 w-5 text-signal" aria-hidden="true" />
          <h2 className="display mt-4 text-xl font-bold">Free forever</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Discovery, alerts, and calendar feeds stay free. Donations only cover
            infrastructure, never feature access.
          </p>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="panel p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Data sources</p>
              <h2 className="display mt-2 text-2xl font-bold">Five platforms, one schema</h2>
            </div>
            <Link href="/contests" className="btn btn-outline btn-sm">
              Browse the schedule
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {PLATFORM_KEYS.map((key) => (
              <a
                key={key}
                href={PLATFORM_META[key].url}
                target="_blank"
                rel="noopener noreferrer"
                data-platform={key}
                className="group rounded-xl border border-line/70 bg-panel-2/40 px-3 py-4 transition-colors hover:border-signal/50"
              >
                <span className="flex items-center gap-2">
                  <span className="platform-dot" aria-hidden="true" />
                  <span className="text-sm font-semibold">{PLATFORM_META[key].name}</span>
                </span>
                <span className="mt-2 block text-xs text-muted">Official or normalized API</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="panel p-6 sm:p-8">
          <h2 className="display text-2xl font-bold">FAQ</h2>
          <div className="mt-5 divide-y divide-line/70">
            <Faq
              q="Is ContestRadar completely free?"
              a="Yes. Contest discovery, alerts, and calendar features stay free. Donations only cover infrastructure."
            />
            <Faq
              q="Does it support other platforms?"
              a="Yes: Codeforces, LeetCode, CodeChef, AtCoder, and HackerRank are normalized into one schedule."
            />
            <Faq
              q="How accurate is the data?"
              a="Sources refresh every five minutes. Each platform adapter fails independently, so one outage does not blank the schedule."
            />
            <Faq
              q="What does the remind button do?"
              a="It opens the alerts page. Telegram reminders work today; email alerts work when the server database and email provider are configured."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-foreground">
        {q}
        <span className="text-muted transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{a}</p>
    </details>
  );
}
