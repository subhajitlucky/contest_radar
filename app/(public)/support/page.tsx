import Link from "next/link";
import { ArrowUpRight, Heart, Server } from "lucide-react";

export const metadata = {
  title: "Support - ContestRadar",
  description:
    "ContestRadar is free forever. Donations cover infrastructure only; contest alerts and features never sit behind a paywall.",
};

const COSTS = [
  { label: "Hosting", amount: "₹0/mo", note: "Vercel free tier while traffic is low" },
  { label: "Domain", amount: "~₹85/mo", note: "₹1,000/year; the first real bill" },
  { label: "Email alerts", amount: "₹0/mo", note: "Free tier for the first few thousand sends" },
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
    href: process.env.NEXT_PUBLIC_SUPPORT_UPI
      ? `upi://pay?pa=${encodeURIComponent(process.env.NEXT_PUBLIC_SUPPORT_UPI)}`
      : "",
    note: "Direct transfer",
  },
];

export default function SupportPage() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <p className="eyebrow flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            Support
          </p>
          <h1 className="display mt-4 max-w-3xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
            Keep the radar <span className="serif-accent">free</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            No paywall on contests, alerts, or calendar feeds. Donations cover infrastructure
            only, and every feature stays available to everyone.
          </p>
        </div>
      </section>

      <section className="space-y-4 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="panel p-6 sm:p-8">
            <h2 className="display text-2xl font-bold">The pledge</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
              <li>Contest discovery, alerts, and calendar export stay free.</li>
              <li>Donations never unlock a feature or hide one from non-donors.</li>
              <li>No sponsored rankings, fake urgency, or sold user data.</li>
              <li>Surplus funds new platform adapters and alert channels.</li>
            </ul>
          </div>

          <div className="panel p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-signal" aria-hidden="true" />
              <h2 className="display text-2xl font-bold">Current cost</h2>
            </div>
            <p className="display mt-4 text-4xl font-bold tracking-tight text-signal">₹0–85</p>
            <p className="mono mt-1 text-[10px] uppercase tracking-wider text-muted">per month</p>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Near zero because the site is static-first, uses official APIs, and keeps alerts
              on free tiers. The domain is the first real bill.
            </p>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-line px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-muted sm:px-7">
            <span>Item</span>
            <span>Monthly</span>
          </div>
          {COSTS.map((cost) => (
            <div
              key={cost.label}
              className="grid grid-cols-[1fr_auto] gap-2 border-b border-line/60 px-5 py-4 last:border-b-0 sm:px-7"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{cost.label}</p>
                <p className="mt-0.5 text-xs text-muted">{cost.note}</p>
              </div>
              <span className="mono text-sm text-foreground">{cost.amount}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {SUPPORT_LINKS.filter((link) => Boolean(link.href)).map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="panel panel-hover flex items-center justify-between gap-4 p-5"
            >
              <span>
                <span className="block text-sm font-semibold text-foreground">{link.label}</span>
                <span className="block text-xs text-muted">{link.note}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 text-signal" aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="panel p-6 sm:p-8">
          <h2 className="display text-2xl font-bold">Where the money goes</h2>
          <ol className="mt-4 space-y-2 text-sm text-muted">
            <li>1. Domain renewal.</li>
            <li>2. Email delivery for alerts.</li>
            <li>3. Database free-tier overages, only if accounts outgrow it.</li>
            <li>4. New platform adapters and alert channels.</li>
          </ol>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Link href="/contests" className="btn btn-signal">
            Back to contests
          </Link>
          <a
            href="https://github.com/subhajitlucky/contest_radar"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Contribute instead
          </a>
        </div>
      </section>
    </div>
  );
}
