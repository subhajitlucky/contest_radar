import Link from "next/link";
import EmailAlertForm from "@/app/components/EmailAlertForm";
import { PLATFORM_META, type PlatformKey } from "@/lib/contestService";

export const metadata = {
  title: "Alerts - ContestRadar",
  description:
    "Free contest alerts via Telegram, email, and calendar feeds for Codeforces, LeetCode, CodeChef, AtCoder, and HackerRank.",
};

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.replace(/^@/, "");

const COMMANDS = [
  { command: "/upcoming", description: "Next five contests across all platforms" },
  { command: "/platforms", description: "Platform counts and the next contest on each" },
  { command: "/subscribe", description: "Enable reminders, optionally per platform" },
  { command: "/status", description: "Show your current alert settings" },
  { command: "/unsubscribe", description: "Disable reminders" },
  { command: "/start", description: "Welcome message and command list" },
];

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string; unsubscribed?: string; error?: string }>;
}) {
  const params = await searchParams;
  const banner =
    params.confirmed === "1"
      ? { tone: "success", text: "Email alerts confirmed. You are on the list." }
      : params.unsubscribed === "1"
        ? { tone: "success", text: "You have been unsubscribed." }
        : params.error
          ? { tone: "error", text: "That link is invalid or expired. Try subscribing again." }
          : null;

  return (
    <div className="bg-white dark:bg-gray-950 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {banner && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-medium ${
              banner.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            {banner.text}
          </div>
        )}

        <div className="text-center space-y-4">
          <p className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            Free forever
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Contest alerts
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Get reminded before contests start. Alerts are free and never sit behind a paywall.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">✈️</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Telegram bot</h2>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Query contests on demand and get the next rounds without opening the site.
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              {COMMANDS.map((item) => (
                <li key={item.command} className="flex flex-col gap-0.5 rounded-lg bg-gray-50 dark:bg-gray-950 px-3 py-2">
                  <code className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {item.command}
                  </code>
                  <span className="text-gray-600 dark:text-gray-400">{item.description}</span>
                </li>
              ))}
            </ul>

            {BOT_USERNAME ? (
              <a
                href={`https://t.me/${BOT_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Open @{BOT_USERNAME}
              </a>
            ) : (
              <p className="mt-5 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                Bot setup in progress. Set <code className="font-mono">NEXT_PUBLIC_TELEGRAM_BOT_USERNAME</code> to show the invite link.
                Scheduled reminders are next.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">📅</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Calendar feeds</h2>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Download an <code className="font-mono text-xs">.ics</code> file or subscribe to a live feed in
              Google Calendar, Apple Calendar, or Outlook.
            </p>

            <div className="mt-4 space-y-2">
              <a
                href="/api/calendar.ics"
                className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span>All platforms</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">.ics</span>
              </a>
              {(Object.keys(PLATFORM_META) as PlatformKey[]).map((key) => (
                <a
                  key={key}
                  href={`/api/calendar.ics?platform=${key}`}
                  className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span>{PLATFORM_META[key].name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">.ics</span>
                </a>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">✉️</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Email alerts</h2>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Pick your platforms and lead time. You will get a confirmation email before reminders start.
          </p>
          <EmailAlertForm />
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contests"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Browse contests
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            Support the project
          </Link>
        </div>
      </div>
    </div>
  );
}
