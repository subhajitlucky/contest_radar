"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Command } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/contests": "Schedule",
  "/alerts": "Alerts",
  "/practice": "Practice",
  "/virtual": "Virtual contest",
  "/profile": "Profile",
  "/leaderboard": "Leaderboard",
  "/about": "About",
  "/support": "Support",
  "/developers": "Developers",
};

export default function TopBar() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "ContestRadar";

  return (
    <header className="app-topbar sticky top-0 z-30 border-b border-line bg-background">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <span className="flex h-6 w-6 items-center justify-center border border-ink">
              <span className="h-1 w-1 bg-signal" />
            </span>
            <span className="text-sm font-semibold tracking-tight">ContestRadar</span>
          </Link>
          <span className="mono hidden text-[10px] uppercase tracking-[0.16em] text-muted lg:block">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("cr-command-open"))}
            className="flex h-8 items-center gap-1.5 rounded-md border border-line px-2.5 text-[11px] text-muted transition-colors hover:border-ink/25 hover:text-ink"
            aria-label="⌘K: open command palette"
          >
            <Command className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="mono hidden sm:inline">⌘K</span>
          </button>
          <span className="lg:hidden">
            <ThemeToggle />
          </span>
          <Link href="/alerts" className="btn btn-signal btn-sm">
            Alerts
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
