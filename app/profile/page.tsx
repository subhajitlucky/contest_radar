import type { Metadata } from "next";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import RatingLookup from "./RatingLookup";
import SyncFavorites from "./SyncFavorites";

export const metadata: Metadata = {
  title: "Profile - ContestRadar",
  description:
    "Look up a Codeforces rating, contest history, and practice recommendations for the next round.",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSessionUser();

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

      <section className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="panel flex flex-wrap items-center justify-between gap-3 p-4">
          {user ? (
            <>
              <div>
                <p className="eyebrow">Signed in</p>
                <p className="mt-1 text-sm font-medium">{user.email}</p>
              </div>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="btn btn-outline btn-sm">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <div>
                <p className="eyebrow">Account</p>
                <p className="mt-1 text-sm text-muted">
                  Sign in to sync favorites across devices.
                </p>
              </div>
              <Link href="/login" className="btn btn-signal btn-sm">
                Sign in
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <SyncFavorites loggedIn={Boolean(user)} />
      </section>

      <section className="px-4 pb-8 sm:px-6 lg:px-8">
        <RatingLookup />
      </section>
    </div>
  );
}
