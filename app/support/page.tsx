import Link from "next/link";

export const metadata = {
  title: "Support - ContestRadar",
  description:
    "ContestRadar is free forever. Donations cover infrastructure only; contest alerts and features never sit behind a paywall.",
};

const COSTS = [
  { label: "Hosting", amount: "₹0/mo", note: "Vercel free tier while traffic is low" },
  { label: "Domain", amount: "~₹85/mo", note: "₹1,000/year; the first real bill" },
  { label: "Email alerts", amount: "₹0/mo", note: "Free tier (Resend/Brevo) for the first few thousand sends" },
  { label: "Database", amount: "₹0/mo", note: "Free tier; only needed once accounts ship" },
  { label: "Push + bots", amount: "₹0/mo", note: "Web push, Telegram, and Discord are free" },
];

const SUPPORT_LINKS = [
  {
    label: "GitHub Sponsors",
    href: process.env.NEXT_PUBLIC_GITHUB_SPONSORS ?? "https://github.com/sponsors/subhajitlucky",
    note: "One-time or monthly",
  },
  {
    label: "UPI",
    href: process.env.NEXT_PUBLIC_SUPPORT_UPI ?? "",
    note: "Set NEXT_PUBLIC_SUPPORT_UPI to enable",
  },
];

export default function SupportPage() {
  return (
    <div className="bg-white dark:bg-gray-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20 text-2xl">
            ❤️
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Keep ContestRadar free.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            No paywall on contests, alerts, or practice tracking. Donations cover
            hosting and infrastructure only, and every feature stays available to everyone.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">The pledge</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li>Contest discovery, alerts, and calendar export stay free.</li>
            <li>Donations never unlock a feature or hide one from non-donors.</li>
            <li>No sponsored rankings, fake urgency, or sold user data.</li>
            <li>If donations exceed costs, the surplus funds new platforms and alerts.</li>
          </ul>
        </div>

        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              What it actually costs
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              The current run rate is near zero: static-first pages, free API tiers,
              and free alert channels.
            </p>
          </div>
          <div className="space-y-3">
            {COSTS.map((cost) => (
              <div
                key={cost.label}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4"
              >
                <div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {cost.label}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {cost.note}
                  </p>
                </div>
                <span className="font-mono text-sm text-gray-900 dark:text-white">
                  {cost.amount}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Estimated current total:{" "}
            <strong className="text-gray-900 dark:text-white">₹0–85/month</strong>.
            The actual amount will be published here when the domain renews.
          </p>
        </div>

        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How to support</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {SUPPORT_LINKS.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  <span>
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      {link.label}
                    </span>
                    <span className="block text-xs text-gray-600 dark:text-gray-400">
                      {link.note}
                    </span>
                  </span>
                  <span className="text-gray-400" aria-hidden="true">→</span>
                </a>
              ) : (
                <div
                  key={link.label}
                  className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-5 opacity-70"
                >
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                    {link.label}
                  </span>
                  <span className="block text-xs text-gray-600 dark:text-gray-400">
                    {link.note}
                  </span>
                </div>
              )
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Prefer another method?{" "}
            <a
              href="https://github.com/subhajitlucky/contest_radar/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-gray-900 dark:hover:text-white"
            >
              Open an issue on GitHub
            </a>
            .
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Where the money goes
          </h2>
          <ol className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li>1. Domain renewal.</li>
            <li>2. Email delivery for alerts.</li>
            <li>3. Database free-tier overages, only if accounts outgrow it.</li>
            <li>4. New platform adapters and alert channels.</li>
          </ol>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contests"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to contests
          </Link>
          <a
            href="https://github.com/subhajitlucky/contest_radar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            Contribute instead
          </a>
        </div>
      </div>
    </div>
  );
}
