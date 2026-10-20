import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import RatingLookup from "./RatingLookup";

export const metadata: Metadata = {
  title: "Profile - ContestRadar",
  description:
    "Look up a Codeforces rating, contest history, and practice recommendations for the next round.",
};

export default function ProfilePage() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <p className="eyebrow flex items-center gap-2">
            <UserRound className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            Profile
          </p>
          <h1 className="display mt-4 max-w-3xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
            Your contest <span className="serif-accent">signal</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Look up a Codeforces handle to see rating history, recent rounds, and what to
            practice next.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <RatingLookup />
      </section>
    </div>
  );
}
