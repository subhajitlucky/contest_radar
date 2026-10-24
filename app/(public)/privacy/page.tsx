import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy - ContestRadar",
  description:
    "ContestRadar privacy policy covering the website, alerts, accounts, and the browser extension.",
};

export default function PrivacyPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Privacy</p>
        <h1 className="display mt-3 text-4xl font-semibold tracking-tight">
          What we collect, and why.
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="text-base font-semibold text-ink">Website</h2>
            <p className="mt-2">
              ContestRadar does not require an account to browse contests. We use Vercel Web
              Analytics for aggregate page views. We do not sell data or run third-party ad
              trackers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">Accounts and alerts</h2>
            <p className="mt-2">
              If you sign in, we store your email, a hashed session token, favorites, and any
              alert subscriptions you create. Email addresses are used only for sign-in links
              and the alerts you request. Alert destinations are stored only to deliver those
              alerts. You can sign out from the profile page.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">Browser extension</h2>
            <p className="mt-2">
              The extension requests only the public ContestRadar API. It does not read
              browsing history, tabs, cookies, or page content, and it stores no personal
              data. The optional storage permission is reserved for a local refresh timestamp.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">Data sources</h2>
            <p className="mt-2">
              Contest schedules come from official and public platform APIs. We link out to
              the original platform for participation and judging. We do not host contest
              submissions.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">Contact</h2>
            <p className="mt-2">
              Open an issue on{" "}
              <a
                href="https://github.com/subhajitlucky/contest_radar/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-ink"
              >
                GitHub
              </a>{" "}
              for privacy questions or deletion requests.
            </p>
          </section>
        </div>

        <div className="mt-10 flex gap-2">
          <Link href="/" className="btn btn-signal btn-sm">
            Back to radar
          </Link>
          <Link href="/support" className="btn btn-outline btn-sm">
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
