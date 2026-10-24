"use client";

import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  CalendarDays,
  Code2,
  Command,
  Info,
  LayoutGrid,
  LifeBuoy,
  Search,
  TimerReset,
  Trophy,
  UserRound,
} from "lucide-react";
import { PLATFORM_META, type PlatformKey } from "@/lib/contestService";

interface Action {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  icon: ComponentType<{ className?: string }>;
  run: () => void;
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = useMemo<Action[]>(() => {
    const go = (href: string) => () => {
      setOpen(false);
      setQuery("");
      setActive(0);
      router.push(href);
    };

    return [
      { id: "overview", label: "Overview", hint: "Your radar", keywords: "home start radar overview", icon: LayoutGrid, run: go("/dashboard") },
      { id: "contests", label: "All contests", hint: "Browse the schedule", keywords: "contests schedule upcoming", icon: CalendarDays, run: go("/contests") },
      { id: "alerts", label: "Set up alerts", hint: "Telegram and email", keywords: "alerts reminders notify telegram email", icon: Bell, run: go("/alerts") },
      { id: "practice", label: "Practice", hint: "Curated practice links", keywords: "practice problems dsa", icon: BookOpen, run: go("/practice") },
      { id: "virtual", label: "Virtual contest", hint: "Timed past round", keywords: "virtual contest timer practice", icon: TimerReset, run: go("/virtual") },
      { id: "profile", label: "Rating profile", hint: "Codeforces history", keywords: "profile rating codeforces history", icon: UserRound, run: go("/profile") },
      { id: "leaderboard", label: "Leaderboard", hint: "Opt-in ratings and streaks", keywords: "leaderboard rating streak", icon: Trophy, run: go("/leaderboard") },
      { id: "about", label: "About", hint: "How it works", keywords: "about data sources", icon: Info, run: go("/about") },
      { id: "support", label: "Support", hint: "Keep it free", keywords: "support donation infra", icon: LifeBuoy, run: go("/support") },
      { id: "developers", label: "Developer API", hint: "Endpoints and docs", keywords: "api developers json docs", icon: Code2, run: go("/developers") },
      ...(Object.keys(PLATFORM_META) as PlatformKey[]).map((key) => ({
        id: `platform-${key}`,
        label: `Filter: ${PLATFORM_META[key].name}`,
        hint: "Open filtered contests",
        keywords: `filter platform ${key} ${PLATFORM_META[key].name}`,
        icon: CalendarDays,
        run: go(`/contests?platform=${key}`),
      })),
      {
        id: "github",
        label: "Open GitHub",
        hint: "Source code",
        keywords: "github source code repository",
        icon: Code2,
        run: () => {
          setOpen(false);
          setQuery("");
          setActive(0);
          window.open("https://github.com/subhajitlucky/contest_radar", "_blank", "noopener,noreferrer");
        },
      },
    ];
  }, [router]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return actions;
    return actions.filter((action) =>
      `${action.label} ${action.hint} ${action.keywords}`.toLowerCase().includes(needle)
    );
  }, [actions, query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setQuery("");
        setActive(0);
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    const onOpen = () => {
      setQuery("");
      setActive(0);
      setOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("cr-command-open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("cr-command-open", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(timeout);
  }, [open]);

  if (!open) return null;

  const runActive = () => {
    const action = filtered[active];
    if (action) action.run();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div className="panel w-full max-w-xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="h-4 w-4 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((index) => Math.min(index + 1, filtered.length - 1));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((index) => Math.max(index - 1, 0));
              }
              if (event.key === "Enter") {
                event.preventDefault();
                runActive();
              }
            }}
            placeholder="Jump to a page, filter, or action..."
            className="h-14 w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
          />
          <span className="kbd hidden sm:inline-flex">esc</span>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">No matches.</p>
          ) : (
            filtered.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={action.run}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    index === active ? "bg-signal text-signal-ink" : "text-foreground hover:bg-panel-2"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{action.label}</span>
                    <span
                      className={`block truncate text-xs ${
                        index === active ? "text-signal-ink/70" : "text-muted"
                      }`}
                    >
                      {action.hint}
                    </span>
                  </span>
                  {index === active && <span className="mono text-[10px] uppercase">enter</span>}
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[10px] text-muted">
          <span className="mono uppercase tracking-wider">ContestRadar command</span>
          <span className="flex items-center gap-1">
            <Command className="h-3 w-3" aria-hidden="true" />K to open
          </span>
        </div>
      </div>
    </div>
  );
}
