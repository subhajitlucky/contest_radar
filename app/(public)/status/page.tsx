import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowUpRight, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { PLATFORM_META, type PlatformKey } from "@/lib/contestService";
import { readSourceHealth, type SourceHealth } from "@/lib/contestStore";
import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Status - ContestRadar",
  description:
    "Live health for every ContestRadar source: last success, latency, failures, and the last persisted schedule refresh.",
};

type SourceState = "operational" | "degraded" | "down" | "waiting";

const STATE_LABEL: Record<SourceState, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
  waiting: "Waiting",
};

const STATE_CLASS: Record<SourceState, string> = {
  operational: "text-emerald-400",
  degraded: "text-amber-400",
  down: "text-red-400",
  waiting: "text-muted",
};

const DOT_CLASS: Record<SourceState, string> = {
  operational: "bg-emerald-400",
  degraded: "bg-amber-400",
  down: "bg-red-400",
  waiting: "bg-muted",
};

function sourceState(source: SourceHealth): SourceState {
  if (!source.lastAttemptAt) return "waiting";
  if (!source.lastSuccessAt) return "down";

  const age = Date.now() - new Date(source.lastSuccessAt).getTime();
  if (source.consecutiveFailures >= 3 || age > 2 * 60 * 60 * 1000) return "down";
  if (source.consecutiveFailures > 0 || age > 30 * 60 * 1000) return "degraded";
  return "operational";
}

function relative(iso: string | null): string {
  if (!iso) return "never";

  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export default async function StatusPage() {
  const sources = isDatabaseConfigured() ? await readSourceHealth() : [];
  const states = sources.map(sourceState);
  const down = states.filter((state) => state === "down").length;
  const degraded = states.filter((state) => state === "degraded").length;
  const waiting = states.filter((state) => state === "waiting").length;
  const overall: SourceState =
    sources.length === 0 || waiting === sources.length
      ? "waiting"
      : down > 0
        ? "down"
        : degraded > 0 || waiting > 0
          ? "degraded"
          : "operational";

  const lastRefresh = sources
    .map((source) => source.lastSuccessAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null;

  return (
    <div>
      <section className="border-b border-line">
        <div className="px-5 py-10 sm:px-8 sm:py-14">
          <p className="eyebrow flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            System status
          </p>
          <h1 className="display mt-4 max-w-3xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
            Five sources. <span className="serif-accent">One honest status.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Every source is checked independently. A source can fail without taking the
            schedule down; the last known schedule stays available.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-5">
            <span className={`inline-flex items-center gap-2 text-sm font-semibold ${STATE_CLASS[overall]}`}>
              <span className={`h-2 w-2 rounded-full ${DOT_CLASS[overall]}`} aria-hidden="true" />
              {overall === "operational"
                ? "All sources operational"
                : overall === "down"
                  ? "Some sources need attention"
                  : overall === "degraded"
                    ? "Some sources are degraded"
                    : "Waiting for the first refresh"}
            </span>
            <span className="mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Last refresh {relative(lastRefresh)}
            </span>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8">
        {sources.length === 0 ? (
          <div className="panel flex flex-col items-center gap-3 px-6 py-16 text-center">
            <Clock3 className="h-6 w-6 text-muted" aria-hidden="true" />
            <p className="text-sm font-medium">No source checks recorded yet.</p>
            <p className="max-w-md text-xs text-muted">
              The status API is available, but the schedule database is not configured or
              the refresh cron has not run yet.
            </p>
            <Link href="/developers" className="btn btn-outline btn-sm">
              API documentation
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((source) => {
              const state = sourceState(source);
              const name =
                PLATFORM_META[source.sourceKey as PlatformKey]?.name ?? source.sourceKey;

              return (
                <article key={source.sourceKey} className="panel min-w-0 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${DOT_CLASS[state]}`} aria-hidden="true" />
                      <h2 className="text-sm font-semibold">{name}</h2>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${STATE_CLASS[state]}`}>
                      {state === "operational" ? (
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      ) : state === "down" ? (
                        <XCircle className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <Clock3 className="h-3 w-3" aria-hidden="true" />
                      )}
                      {STATE_LABEL[state]}
                    </span>
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4">
                    <Fact label="Last success" value={relative(source.lastSuccessAt)} />
                    <Fact label="Latency" value={source.latencyMs === null ? "—" : `${source.latencyMs}ms`} />
                    <Fact label="Contests" value={source.lastContestCount === null ? "—" : String(source.lastContestCount)} />
                    <Fact label="Failures" value={String(source.consecutiveFailures)} />
                  </dl>

                  {source.lastError && (
                    <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-red-400">
                      {source.lastError}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="border-t border-line px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">
            Data comes from the last persisted refresh. A source failure never removes the
            last known schedule.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/contests" className="btn btn-outline btn-sm">
              Browse the schedule
            </Link>
            <a href="/api/source-health" className="btn btn-ghost btn-sm">
              JSON
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1 text-[13px] font-medium">{value}</dd>
    </div>
  );
}
