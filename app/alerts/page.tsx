import Link from "next/link";
import { Bell } from "lucide-react";
import AlertsConsole from "@/app/components/AlertsConsole";

export const metadata = {
  title: "Alerts - ContestRadar",
  description:
    "Free contest alerts via Telegram, email, and calendar feeds for Codeforces, LeetCode, CodeChef, AtCoder, and HackerRank.",
};

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.replace(/^@/, "");

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
    <div>
      <section className="border-b border-line">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <p className="eyebrow flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            Free forever
          </p>
          <h1 className="display mt-4 max-w-3xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
            Get the signal <span className="serif-accent">first</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Choose Telegram, email, or a calendar feed. Reminders are free and never sit
            behind a paywall.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        {banner && (
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-sm font-medium ${
              banner.tone === "success"
                ? "border-signal/40 bg-signal/10 text-ink"
                : "border-hot/40 bg-hot/10 text-ink"
            }`}
          >
            {banner.text}
          </div>
        )}

        <AlertsConsole botUsername={BOT_USERNAME} />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
          <p className="max-w-xl text-xs leading-relaxed text-muted">
            Email reminders need the server database and email provider configured.
            Telegram and calendar feeds work today.
          </p>
          <div className="flex gap-2">
            <Link href="/contests" className="btn btn-ghost btn-sm">
              Browse contests
            </Link>
            <Link href="/support" className="btn btn-outline btn-sm">
              Support the project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
