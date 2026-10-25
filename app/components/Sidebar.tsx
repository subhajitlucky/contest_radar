"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Code2,
  Command,
  Info,
  LayoutDashboard,
  LifeBuoy,
  TimerReset,
  Trophy,
  UserRound,
} from "lucide-react";
import { PLATFORM_META, type Contest, type PlatformKey } from "@/lib/contestService";
import Countdown from "./Countdown";
import ThemeToggle from "./ThemeToggle";

const NAV_GROUPS = [
  {
    label: "Radar",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/contests", label: "Schedule", icon: CalendarDays },
      { href: "/alerts", label: "Alerts", icon: Bell },
    ],
  },
  {
    label: "Prepare",
    items: [
      { href: "/practice", label: "Practice", icon: BookOpen },
      { href: "/virtual", label: "Virtual contest", icon: TimerReset },
      { href: "/profile", label: "Profile", icon: UserRound },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    ],
  },
];

const PROJECT = [
  { href: "/developers", label: "Developers", icon: Code2 },
  { href: "/about", label: "About", icon: Info },
  { href: "/support", label: "Support", icon: LifeBuoy },
];

const PLATFORM_KEYS = Object.keys(PLATFORM_META) as PlatformKey[];

export default function Sidebar({ nextContest }: { nextContest: Contest | null }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="app-sidebar fixed inset-y-0 left-0 z-40 hidden w-[276px] flex-col border-r border-line bg-panel lg:flex">
      <div className="flex h-16 items-center border-b border-line px-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border border-ink">
            <span className="h-1.5 w-1.5 bg-signal" />
          </span>
          <span>
            <span className="block text-[17px] font-semibold leading-none tracking-tight">
              ContestRadar
            </span>
            <span className="mono mt-1 block text-[10px] uppercase tracking-[0.16em] text-muted">
              contest intelligence
            </span>
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {NAV_GROUPS.map((group, groupIndex) => (
          <section key={group.label} className={groupIndex === 0 ? "" : "mt-5"}>
            <p className="eyebrow px-3">{group.label}</p>
            <nav className="mt-2 space-y-0.5" aria-label={group.label}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-panel-2 text-ink"
                        : "text-muted hover:bg-panel-2 hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </section>
        ))}

        <p className="eyebrow mt-5 px-3">Platforms</p>
        <nav className="mt-2 space-y-0.5" aria-label="Platforms">
          {PLATFORM_KEYS.map((key) => (
            <Link
              key={key}
              href={`/contests?platform=${key}`}
              data-platform={key}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-panel-2 hover:text-ink"
            >
              <span className="platform-dot" aria-hidden="true" />
              {PLATFORM_META[key].name}
            </Link>
          ))}
        </nav>

        <p className="eyebrow mt-5 px-3">Project</p>
        <nav className="mt-2 space-y-0.5" aria-label="Project">
          {PROJECT.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-panel-2 hover:text-ink"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-line p-3">
        {nextContest && (
          <Link
            href="/contests"
            data-platform={nextContest.platformKey}
            className="block rounded-lg border border-line bg-background p-3.5 transition-colors hover:border-ink/25"
          >
            <span className="flex items-center gap-2">
              <span className="platform-dot" aria-hidden="true" />
              <span className="eyebrow">Next up</span>
            </span>
            <span className="mt-2 block truncate text-sm font-medium">{nextContest.name}</span>
            <Countdown
              startTime={nextContest.startTime}
              className="mono mt-1 block text-xs tabular-nums text-signal"
            />
          </Link>
        )}

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("cr-command-open"))}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-muted hover:bg-panel-2 hover:text-ink"
            aria-label="⌘K: open command palette"
          >
            <Command className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="mono">⌘K</span>
          </button>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <a
              href="https://github.com/subhajitlucky/contest_radar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-panel-2 hover:text-ink"
              aria-label="GitHub repository"
            >
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
