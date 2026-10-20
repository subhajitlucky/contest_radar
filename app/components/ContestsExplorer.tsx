"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronRight,
  Download,
  LayoutGrid,
  Rows3,
  Search,
  Star,
  X,
} from "lucide-react";
import {
  PLATFORM_META,
  formatDuration,
  formatISTDate,
  formatISTTime,
  getContestStatus,
  getGoogleCalendarUrl,
  istDayKey,
  type Contest,
  type PlatformKey,
} from "@/lib/contestService";
import ContestCard from "./ContestCard";
import Countdown from "./Countdown";
import FavoriteButton from "./FavoriteButton";
import {
  contestKey,
  getFavoritesSnapshot,
  parseFavorites,
  subscribeFavorites,
} from "@/lib/favorites";

type PlatformFilter = "all" | PlatformKey;
type ViewMode = "agenda" | "grid";

const PLATFORM_KEYS = Object.keys(PLATFORM_META) as PlatformKey[];

export default function ContestsExplorer({
  contests,
  initialPlatform = "all",
  initialQuery = "",
  initialHighlight,
}: {
  contests: Contest[];
  initialPlatform?: PlatformFilter;
  initialQuery?: string;
  initialHighlight?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [platform, setPlatform] = useState<PlatformFilter>(initialPlatform);
  const [view, setView] = useState<ViewMode>("agenda");
  const [savedOnly, setSavedOnly] = useState(false);
  const favoritesRaw = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    () => ""
  );
  const favorites = useMemo(() => parseFavorites(favoritesRaw), [favoritesRaw]);
  const [selected, setSelected] = useState<Contest | null>(() => {
    if (!initialHighlight) return null;
    return contests.find((contest) => `${contest.platformKey}:${contest.id}` === initialHighlight) ?? null;
  });
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (platform !== "all") params.set("platform", platform);
    if (query.trim()) params.set("q", query.trim());
    const next = params.toString();
    window.history.replaceState(null, "", next ? `${window.location.pathname}?${next}` : window.location.pathname);
  }, [platform, query]);

  useEffect(() => {
    if (!selected) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  const counts = useMemo(() => {
    const map = new Map<PlatformKey, number>();
    for (const contest of contests) {
      map.set(contest.platformKey, (map.get(contest.platformKey) ?? 0) + 1);
    }
    return map;
  }, [contests]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return contests
      .filter((contest) => {
        if (platform !== "all" && contest.platformKey !== platform) return false;
        if (savedOnly && !favorites.includes(contestKey(contest))) return false;
        if (!needle) return true;
        return `${contest.name} ${contest.platform} ${contest.type}`.toLowerCase().includes(needle);
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [contests, platform, query, savedOnly, favorites]);

  const live = filtered.filter((contest) => getContestStatus(contest.startTime, contest.endTime) === "live");
  const upcoming = filtered.filter((contest) => getContestStatus(contest.startTime, contest.endTime) === "upcoming");

  const groups = useMemo(() => {
    const map = new Map<string, Contest[]>();
    for (const contest of upcoming) {
      const key = istDayKey(contest.startTime);
      const list = map.get(key) ?? [];
      list.push(contest);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [upcoming]);

  const hasFilters = platform !== "all" || query.trim().length > 0 || savedOnly;

  return (
    <div className="space-y-4">
      <div className="sticky top-14 z-20 -mx-4 border-b border-line bg-background px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search contests, platforms, or rounds..."
              aria-label="Search contests"
              className="field h-10 pl-10"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setPlatform("all")}
                aria-pressed={platform === "all"}
                className={`chip shrink-0 ${platform === "all" ? "chip-active" : ""}`}
              >
                All
                <span className="opacity-60">{contests.length}</span>
              </button>
              <button
                type="button"
                onClick={() => setSavedOnly((value) => !value)}
                aria-pressed={savedOnly}
                className={`chip shrink-0 ${savedOnly ? "chip-active" : ""}`}
              >
                <Star className="h-3 w-3" aria-hidden="true" />
                Saved
                <span className="opacity-60">{favorites.length}</span>
              </button>
              {PLATFORM_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPlatform(key)}
                  aria-pressed={platform === key}
                  data-platform={key}
                  className={`chip shrink-0 ${platform === key ? "chip-active" : ""}`}
                >
                  <span className="platform-dot" aria-hidden="true" />
                  {PLATFORM_META[key].name}
                  <span className="opacity-60">{counts.get(key) ?? 0}</span>
                </button>
              ))}
            </div>

            <div className="flex shrink-0 items-center rounded-md border border-line p-0.5">
              <button
                type="button"
                onClick={() => setView("agenda")}
                aria-pressed={view === "agenda"}
                aria-label="Agenda view"
                className={`flex h-7 w-7 items-center justify-center rounded ${
                  view === "agenda" ? "bg-panel-2 text-ink" : "text-muted hover:text-ink"
                }`}
              >
                <Rows3 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                aria-label="Grid view"
                className={`flex h-7 w-7 items-center justify-center rounded ${
                  view === "grid" ? "bg-panel-2 text-ink" : "text-muted hover:text-ink"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {filtered.length} contest{filtered.length === 1 ? "" : "s"} · times in IST
        </p>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setPlatform("all");
                setSavedOnly(false);
              }}
              className="text-[11px] font-medium text-muted underline underline-offset-4 hover:text-ink"
            >
              Clear
            </button>
          )}
          <a href="/api/calendar.ics" className="btn btn-ghost btn-sm">
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Export .ics
          </a>
        </div>
      </div>

      {live.length > 0 && (
        <section className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <span className="status-live mono text-[10px]">LIVE NOW</span>
          </div>
          <div className="divide-y divide-line">
            {live.map((contest) => (
              <button
                key={`${contest.platformKey}-${contest.id}`}
                type="button"
                onClick={() => setSelected(contest)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-panel-2"
              >
                <span className="platform-dot" data-platform={contest.platformKey} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{contest.name}</span>
                  <span className="mono block text-[10px] uppercase tracking-wider text-muted">
                    {contest.platform} · ends {formatISTTime(contest.endTime)}
                  </span>
                </span>
                <Countdown startTime={contest.endTime} className="mono text-[11px] text-signal" />
                <ChevronRight className="h-4 w-4 text-muted" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 ? (
        <div className="panel flex flex-col items-center gap-4 px-6 py-16 text-center">
          <p className="text-base font-medium">No contests match this view.</p>
          <p className="max-w-md text-sm text-muted">
            Try another platform or clear the search. Sources refresh every five minutes.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setPlatform("all");
              setSavedOnly(false);
            }}
            className="btn btn-signal"
          >
            Clear filters
          </button>
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((contest) => (
            <ContestCard key={`${contest.platformKey}-${contest.id}`} contest={contest} />
          ))}
        </div>
      ) : (
        <div className="border-t border-line">
          {groups.map(([day, items]) => (
            <section key={day} className="grid gap-3 border-b border-line py-5 sm:grid-cols-[132px_1fr] sm:gap-6">
              <div>
                <p className="mono text-[11px] font-medium uppercase tracking-wider">
                  {formatISTDate(items[0].startTime)}
                </p>
                <p className="mono mt-1 text-[10px] uppercase tracking-wider text-muted">
                  {items.length} round{items.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="divide-y divide-line/70">
                {items.map((contest) => (
                  <button
                    key={`${contest.platformKey}-${contest.id}`}
                    type="button"
                    onClick={() => setSelected(contest)}
                    data-platform={contest.platformKey}
                    className="group grid w-full grid-cols-[64px_12px_1fr_auto_16px] items-center gap-3 px-2 py-3 text-left transition-colors hover:bg-panel"
                  >
                    <span className="mono whitespace-nowrap text-[11px] tabular-nums text-muted">
                      {formatISTTime(contest.startTime)}
                    </span>
                    <span className="platform-dot" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium group-hover:text-signal">
                        {contest.name}
                      </span>
                      <span className="mono block text-[10px] uppercase tracking-wider text-muted">
                        {contest.platform} · {contest.type} · {formatDuration(contest.duration)}
                      </span>
                    </span>
                    <Countdown
                      startTime={contest.startTime}
                      className="mono text-[10px] tabular-nums text-muted"
                    />
                    <ChevronRight className="h-4 w-4 text-muted" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <button
            type="button"
            aria-label="Close contest details"
            className="absolute inset-0 bg-black/55"
            onClick={() => setSelected(null)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
            className="relative h-full w-full max-w-md overflow-y-auto border-l border-line bg-panel p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <span className="eyebrow" data-platform={selected.platformKey}>
                <span className="mr-2 inline-block platform-dot align-middle" aria-hidden="true" />
                {selected.platform}
              </span>
              <div className="flex items-center gap-1">
                <FavoriteButton contestKey={contestKey(selected)} />
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-muted hover:text-ink"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <h2 className="display mt-6 text-2xl font-semibold leading-tight tracking-tight">
              {selected.name}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="chip">{selected.type}</span>
              {selected.difficulty && <span className="chip">{selected.difficulty}</span>}
            </div>

            <dl className="mt-6 divide-y divide-line border-y border-line">
              <DetailRow label="Date" value={formatISTDate(selected.startTime)} />
              <DetailRow label="Start" value={`${formatISTTime(selected.startTime)} IST`} />
              <DetailRow label="Duration" value={formatDuration(selected.duration)} />
              <DetailRow label="Status" value={getContestStatus(selected.startTime, selected.endTime)} />
            </dl>

            <div className="mt-6">
              <p className="eyebrow">Starts in</p>
              <Countdown
                startTime={selected.startTime}
                className="mono mt-1 block text-3xl font-medium tabular-nums text-signal"
              />
            </div>

            {selected.description && (
              <p className="mt-6 text-sm leading-relaxed text-muted">{selected.description}</p>
            )}

            <div className="mt-7 grid gap-2">
              <a href={selected.url} target="_blank" rel="noopener noreferrer" className="btn btn-signal w-full">
                Open contest
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={getGoogleCalendarUrl(selected)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full"
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Add to calendar
              </a>
              <Link href="/alerts" className="btn btn-outline w-full">
                <Bell className="h-4 w-4" aria-hidden="true" />
                Set a reminder
              </Link>
              <Link
                href={`/contests/${selected.platformKey}/${encodeURIComponent(String(selected.id))}`}
                className="btn btn-ghost w-full"
              >
                View full page
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="eyebrow">{label}</dt>
      <dd className="text-[13px] font-medium">{value}</dd>
    </div>
  );
}
