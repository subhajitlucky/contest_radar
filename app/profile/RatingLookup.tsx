"use client";

import { type FormEvent, useState } from "react";
import { ArrowUpRight, ExternalLink, Search, Target, TrendingUp, Trophy } from "lucide-react";

interface Profile {
  handle: string;
  rating: number | null;
  maxRating: number | null;
  rank: string;
  maxRank: string;
  country: string | null;
  organization: string | null;
  contribution: number;
  friends: number;
}

interface RatingPoint {
  contestId: number;
  contestName: string;
  rank: number;
  timestamp: number;
  oldRating: number;
  newRating: number;
  delta: number;
}

interface RatingResponse {
  ok: boolean;
  profile?: Profile;
  stats?: { contests: number; bestRank: number | null; maxDelta: number | null };
  history?: RatingPoint[];
  error?: string;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function practiceFor(rating: number | null) {
  if (rating === null || rating < 1200) {
    return [
      {
        label: "Two Sum: brute force to hash map",
        href: "https://cscosmos.vercel.app/interview/dsa/two-sum-brute-force-to-hashmap",
      },
      { label: "Arrays & cache locality", href: "https://cscosmos.vercel.app/dsa/arrayviz" },
      { label: "Floyd cycle detection", href: "https://cscosmos.vercel.app/interview/dsa/floyd-cycle-detection" },
    ];
  }
  if (rating < 1600) {
    return [
      { label: "KMP string matching", href: "https://cscosmos.vercel.app/interview/dsa/kmp-linear-string-matching" },
      { label: "LRU cache design", href: "https://cscosmos.vercel.app/interview/dsa/lru-cache-hashmap-doubly-linked-list" },
      { label: "String algorithms", href: "https://cscosmos.vercel.app/dsa/stringalgoviz" },
    ];
  }
  return [
    { label: "System design visualizers", href: "https://cscosmos.vercel.app/advanced/systemdesignviz" },
    { label: "Transaction isolation", href: "https://cscosmos.vercel.app/interview/fullstack/transaction-isolation-levels-anomalies" },
    { label: "Exactly-once payment retries", href: "https://cscosmos.vercel.app/interview/fullstack/exactly-once-payment-retries" },
  ];
}

export default function RatingLookup() {
  const [handle, setHandle] = useState("");
  const [data, setData] = useState<RatingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = handle.trim();
    if (!value) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/rating?handle=${encodeURIComponent(value)}`);
      const payload = (await response.json()) as RatingResponse;
      if (!response.ok || !payload.ok) {
        setData(null);
        setError(payload.error ?? "Could not load that profile.");
      } else {
        setData(payload);
      }
    } catch {
      setData(null);
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const history = data?.history ?? [];
  const recommendations = practiceFor(data?.profile?.rating ?? null);

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="panel p-4 sm:p-5">
        <label htmlFor="cf-handle" className="eyebrow">
          Codeforces handle
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id="cf-handle"
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder="tourist"
              className="field h-10 pl-10"
              autoComplete="username"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-signal">
            {loading ? "Loading…" : "Load profile"}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-hot">{error}</p>}
        <p className="mt-2 text-[10px] text-muted">
          Reads the official Codeforces API. Nothing is stored on ContestRadar.
        </p>
      </form>

      {data?.profile && (
        <>
          <section className="panel p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-sm font-semibold">
                  {data.profile.handle.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">{data.profile.handle}</h2>
                  <p className="mono text-[10px] uppercase tracking-wider text-muted">
                    {data.profile.rank}
                    {data.profile.country ? ` · ${data.profile.country}` : ""}
                  </p>
                </div>
              </div>
              <a
                href={`https://codeforces.com/profile/${data.profile.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                Codeforces profile
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-4">
              <Stat label="Rating" value={data.profile.rating?.toString() ?? "—"} />
              <Stat label="Max rating" value={data.profile.maxRating?.toString() ?? "—"} />
              <Stat label="Contests" value={String(data.stats?.contests ?? 0)} />
              <Stat label="Best rank" value={data.stats?.bestRank?.toString() ?? "—"} />
            </div>
          </section>

          {history.length > 1 && (
            <section className="panel p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="eyebrow">Rating trend</p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight">
                    Last {history.length} contests
                  </h2>
                </div>
                <span className="mono text-[10px] uppercase tracking-wider text-muted">
                  max delta {data.stats?.maxDelta ?? 0}
                </span>
              </div>
              <RatingChart history={history} />
            </section>
          )}

          {history.length > 0 && (
            <section className="panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <h2 className="text-sm font-semibold">Recent contests</h2>
                <span className="mono text-[10px] uppercase tracking-wider text-muted">
                  rating changes
                </span>
              </div>
              <div className="divide-y divide-line">
                {[...history]
                  .reverse()
                  .slice(0, 10)
                  .map((item) => (
                    <div
                      key={`${item.contestId}-${item.timestamp}`}
                      className="flex flex-wrap items-center gap-3 px-5 py-3"
                    >
                      <span
                        className={`mono w-12 shrink-0 text-[11px] font-medium ${
                          item.delta >= 0 ? "text-signal" : "text-hot"
                        }`}
                      >
                        {item.delta >= 0 ? "+" : ""}
                        {item.delta}
                      </span>
                      <span className="min-w-0 flex-1">
                        <a
                          href={`https://codeforces.com/contest/${item.contestId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate text-[13px] font-medium hover:text-signal"
                        >
                          {item.contestName}
                        </a>
                        <span className="mono block text-[10px] uppercase tracking-wider text-muted">
                          {formatDate(item.timestamp)} · rank {item.rank} · {item.oldRating} →{" "}
                          {item.newRating}
                        </span>
                      </span>
                      <a
                        href={`https://codeforces.com/contest/${item.contestId}/standings`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-semibold text-muted hover:text-ink"
                      >
                        Standings
                      </a>
                    </div>
                  ))}
              </div>
            </section>
          )}

          <section className="panel p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-signal" aria-hidden="true" />
              <h2 className="text-sm font-semibold">Practice next</h2>
            </div>
            <p className="mt-1 text-xs text-muted">
              Based on your current rating. These open the CSCosmos learning companion.
            </p>
            <div className="mt-3 divide-y divide-line border-y border-line">
              {recommendations.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 py-2.5 text-[13px] transition-colors hover:text-signal"
                >
                  {item.label}
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted group-hover:text-signal" aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        </>
      )}

      {!data && !loading && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Info icon={Trophy} title="History" body="Rating changes from official Codeforces contests." />
          <Info icon={TrendingUp} title="Trend" body="A clean rating chart for the last 30 rounds." />
          <Info icon={Target} title="Next step" body="Practice recommendations matched to your rating." />
        </div>
      )}
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

function Info({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Trophy;
  title: string;
  body: string;
}) {
  return (
    <div className="panel p-5">
      <Icon className="h-4 w-4 text-signal" aria-hidden="true" />
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function RatingChart({ history }: { history: RatingPoint[] }) {
  const points = history.map((item) => item.newRating);
  const min = Math.min(...points) - 40;
  const max = Math.max(...points) + 40;
  const width = 620;
  const height = 180;
  const pad = 10;

  const coords = points.map((value, index) => {
    const x = pad + (index / Math.max(1, points.length - 1)) * (width - pad * 2);
    const y = height - pad - ((value - min) / Math.max(1, max - min)) * (height - pad * 2);
    return `${x},${y}`;
  });

  return (
    <div className="mt-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-44 w-full"
        role="img"
        aria-label="Codeforces rating over recent contests"
      >
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="var(--line)" />
        <polyline
          points={coords.join(" ")}
          fill="none"
          stroke="var(--signal)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {coords.map((point, index) => {
          const [x, y] = point.split(",");
          return (
            <circle
              key={`${point}-${index}`}
              cx={x}
              cy={y}
              r="2.5"
              fill="var(--signal)"
            />
          );
        })}
      </svg>
      <div className="mono flex justify-between text-[9px] uppercase tracking-wider text-muted">
        <span>{formatDate(history[0].timestamp)}</span>
        <span>{formatDate(history[history.length - 1].timestamp)}</span>
      </div>
    </div>
  );
}
