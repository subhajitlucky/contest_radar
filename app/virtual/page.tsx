import type { Metadata } from "next";
import { TimerReset } from "lucide-react";
import { getPastContests } from "@/lib/contestService";
import VirtualContest from "./VirtualContest";

export const metadata: Metadata = {
  title: "Virtual Contest - ContestRadar",
  description:
    "Run a timed virtual contest using a past Codeforces round, then review your sessions.",
};

export const revalidate = 3600;

export default async function VirtualContestPage() {
  const contests = await getPastContests(40);

  return (
    <div>
      <section className="border-b border-line">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <p className="eyebrow flex items-center gap-2">
            <TimerReset className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            Virtual contest
          </p>
          <h1 className="display mt-4 max-w-3xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
            Re-run an old <span className="serif-accent">round</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Pick a past Codeforces contest, set the clock, and solve on the original page.
            No judge, no account, no pressure beyond the timer.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        {contests.length > 0 ? (
          <VirtualContest contests={contests} />
        ) : (
          <div className="panel p-8 text-sm text-muted">
            Past contests are unavailable right now. Try again later.
          </div>
        )}
      </section>
    </div>
  );
}
