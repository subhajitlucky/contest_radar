"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  DEFAULT_TIME_ZONE,
  TIME_ZONE_OPTIONS,
  isValidTimeZone,
} from "@/lib/timezone";

const TIMEZONE_EVENT = "cr-timezone-change";

function readCookie(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(?:^|;\s*)cr_tz=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getSnapshot(): string {
  const stored = readCookie();
  return stored && isValidTimeZone(stored) ? stored : DEFAULT_TIME_ZONE;
}

function getServerSnapshot(): string {
  return DEFAULT_TIME_ZONE;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(TIMEZONE_EVENT, callback);
  return () => window.removeEventListener(TIMEZONE_EVENT, callback);
}

export default function TimezoneSelect() {
  const router = useRouter();
  const timeZone = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function change(next: string) {
    document.cookie = `cr_tz=${encodeURIComponent(next)}; path=/; max-age=31536000; samesite=lax`;
    window.dispatchEvent(new Event(TIMEZONE_EVENT));
    router.refresh();
  }

  return (
    <select
      value={timeZone}
      onChange={(event) => change(event.target.value)}
      aria-label="Time zone"
      title="Time zone"
      className="h-8 max-w-[9.5rem] rounded-md border border-line bg-background px-2 font-mono text-[10px] text-muted transition-colors hover:border-ink/25 hover:text-ink"
    >
      {TIME_ZONE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
