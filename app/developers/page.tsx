import Link from "next/link";
import { Code2, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Developers - ContestRadar",
  description:
    "Free read-only APIs for the ContestRadar multi-platform contest schedule, stats, and calendar feeds.",
};

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/contests",
    description:
      "All upcoming contests across five platforms. Optional query: ?platform=codeforces.",
    sample: `{
  "success": true,
  "data": [
    {
      "id": 2277,
      "name": "Codeforces Round (Div. 2)",
      "platform": "Codeforces",
      "platformKey": "codeforces",
      "startTime": "2026-10-24T11:05:00.000Z",
      "duration": 120,
      "url": "https://codeforces.com/contest/2277"
    }
  ],
  "count": 15
}`,
  },
  {
    method: "GET",
    path: "/api/contests/2277",
    description:
      "One contest. Accepts a bare id or a namespaced id such as codeforces:2277.",
    sample: `{
  "success": true,
  "data": {
    "id": 2277,
    "name": "Codeforces Round (Div. 2)",
    "platform": "Codeforces"
  }
}`,
  },
  {
    method: "GET",
    path: "/api/stats",
    description: "Upcoming, live, next-24h counts, and a per-platform breakdown.",
    sample: `{
  "success": true,
  "data": {
    "totalContests": 15,
    "upcoming": 15,
    "active": 0,
    "next24h": 1,
    "platforms": [
      { "platform": "Codeforces", "totalContests": 3 }
    ]
  }
}`,
  },
  {
    method: "GET",
    path: "/api/source-health",
    description:
      "Last attempt, last success, error, latency, and consecutive failures for each schedule source.",
    sample: `{
  "ok": true,
  "data": [
    {
      "sourceKey": "codeforces",
      "lastSuccessAt": "2026-10-23T10:15:00.000Z",
      "latencyMs": 120,
      "lastContestCount": 3,
      "consecutiveFailures": 0
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/rating?handle=tourist",
    description:
      "Codeforces profile, max rating, contest count, best rank, and up to 30 rating changes.",
    sample: `{
  "ok": true,
  "profile": {
    "handle": "tourist",
    "rating": 3800,
    "maxRating": 4009,
    "rank": "legendary grandmaster"
  },
  "stats": { "contests": 120, "bestRank": 1, "maxDelta": 120 },
  "history": [
    {
      "contestId": 2222,
      "rank": 1,
      "oldRating": 3780,
      "newRating": 3800,
      "delta": 20
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/calendar.ics?platform=atcoder",
    description:
      "Live iCalendar feed. Omit platform for all platforms; subscribe in Google, Apple, or Outlook.",
    sample: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ContestRadar//Contest Calendar//EN
BEGIN:VEVENT
SUMMARY:AtCoder Beginner Contest 481
DTSTART:20261024T120000Z
END:VEVENT
END:VCALENDAR`,
  },
  {
    method: "GET",
    path: "/api/alerts/cron",
    description:
      "Internal scheduled sender for confirmed alerts. Requires Authorization: Bearer CRON_SECRET.",
    sample: `HTTP/1.1 401 Unauthorized
{ "ok": false, "error": "Unauthorized" }`,
  },
];

export default function DevelopersPage() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <p className="eyebrow flex items-center gap-2">
            <Code2 className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            Developers
          </p>
          <h1 className="display mt-4 max-w-3xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
            Build on the <span className="serif-accent">schedule</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Read-only JSON endpoints for contests, stats, and calendar feeds. No API keys,
            no paywall. Cache responses and attribute ContestRadar.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <aside className="panel h-fit p-5">
            <p className="eyebrow">Base URL</p>
            <code className="mt-2 block break-all rounded-md border border-line bg-panel-2 px-3 py-2 font-mono text-[11px]">
              https://contestradar.vercel.app
            </code>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Responses are cached. Use a clear User-Agent and link back to ContestRadar
              when you display the data.
            </p>
            <a
              href="https://github.com/subhajitlucky/contest_radar"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-signal"
            >
              Source and issues
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </aside>

          <div className="space-y-3">
            {ENDPOINTS.map((endpoint) => (
              <article key={endpoint.path} className="panel p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip chip-active">{endpoint.method}</span>
                  <code className="mono break-all text-[12px] font-medium">{endpoint.path}</code>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{endpoint.description}</p>
                <pre className="mt-3 overflow-x-auto rounded-md border border-line bg-panel-2 p-3 font-mono text-[10px] leading-relaxed text-muted">
                  {endpoint.sample}
                </pre>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6">
          <Link href="/contests" className="btn btn-signal">
            Browse contests
          </Link>
          <Link href="/alerts" className="btn btn-outline">
            Set up alerts
          </Link>
        </div>
      </section>
    </div>
  );
}
