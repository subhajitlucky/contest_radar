"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import {
  FAVORITES_EVENT,
  FAVORITES_KEY,
  getFavoritesSnapshot,
  parseFavorites,
  subscribeFavorites,
} from "@/lib/favorites";

export default function SyncFavorites({ loggedIn }: { loggedIn: boolean }) {
  const raw = useSyncExternalStore(subscribeFavorites, getFavoritesSnapshot, () => "");
  const local = useMemo(() => parseFavorites(raw), [raw]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const push = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites: local }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Sync failed.");
      setStatus("success");
      setMessage(`Synced ${local.length} favorites to your account.`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Sync failed.");
    }
  };

  const pull = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/user/favorites", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Sync failed.");

      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(payload.favorites ?? []));
      window.dispatchEvent(new Event(FAVORITES_EVENT));
      setStatus("success");
      setMessage(`Pulled ${payload.favorites?.length ?? 0} favorites from your account.`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Sync failed.");
    }
  };

  if (!loggedIn) {
    return (
      <div className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Account sync</p>
            <p className="mt-1 text-sm text-muted">
              Sign in to sync favorites across devices.
            </p>
          </div>
          <Link href="/login" className="btn btn-signal btn-sm">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Account sync</p>
          <p className="mt-1 text-sm text-muted">
            {local.length} favorite{local.length === 1 ? "" : "s"} on this device.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={push}
            disabled={status === "loading"}
            className="btn btn-outline btn-sm"
          >
            <ArrowUpFromLine className="h-3.5 w-3.5" aria-hidden="true" />
            Push local
          </button>
          <button
            type="button"
            onClick={pull}
            disabled={status === "loading"}
            className="btn btn-outline btn-sm"
          >
            <ArrowDownToLine className="h-3.5 w-3.5" aria-hidden="true" />
            Pull account
          </button>
        </div>
      </div>
      {message && (
        <p className={`mt-2 text-xs ${status === "success" ? "text-signal" : "text-hot"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
