import type { Metadata } from "next";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in - ContestRadar",
  description: "Passwordless sign-in for ContestRadar accounts.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [user, params] = await Promise.all([getSessionUser(), searchParams]);
  const error =
    params.error === "expired"
      ? "That sign-in link expired or was already used."
      : params.error
        ? "That sign-in link is invalid."
        : null;
  const emailConfigured = Boolean(
    process.env.RESEND_API_KEY && process.env.ALERT_FROM_EMAIL,
  );

  return (
    <div>
      <section className="border-b border-line">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <p className="eyebrow flex items-center gap-2">
            <LogIn className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            Account
          </p>
          <h1 className="display mt-4 max-w-3xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
            Sign in, <span className="serif-accent">sync</span> everything.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Passwordless email links. Favorites and settings follow you across devices.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="panel max-w-md p-6 sm:p-7">
          {user ? (
            <div className="space-y-4">
              <p className="text-sm text-muted">Signed in as</p>
              <p className="text-lg font-semibold">{user.email}</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/dashboard" className="btn btn-signal">
                  Open dashboard
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button type="submit" className="btn btn-outline">
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          ) : !emailConfigured ? (
            <div className="space-y-3">
              <p className="text-sm font-medium">Email sign-in is not configured yet.</p>
              <p className="text-xs leading-relaxed text-muted">
                An administrator needs to set <code>RESEND_API_KEY</code> and{" "}
                <code>ALERT_FROM_EMAIL</code> before magic links can be sent.
              </p>
              <Link href="/contests" className="btn btn-outline btn-sm">
                Browse the schedule
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <p className="mb-4 rounded-lg border border-hot/40 bg-hot/10 px-3 py-2 text-xs text-ink">
                  {error}
                </p>
              )}
              <LoginForm />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
