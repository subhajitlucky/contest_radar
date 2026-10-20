"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Star } from "lucide-react";
import {
  getFavoritesSnapshot,
  parseFavorites,
  subscribeFavorites,
  toggleFavorite,
} from "@/lib/favorites";

export default function FavoriteButton({
  contestKey,
  className = "",
}: {
  contestKey: string;
  className?: string;
}) {
  const raw = useSyncExternalStore(subscribeFavorites, getFavoritesSnapshot, () => "");
  const favorites = useMemo(() => parseFavorites(raw), [raw]);
  const active = favorites.includes(contestKey);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(contestKey)}
      aria-pressed={active}
      aria-label={active ? "Remove from saved contests" : "Save contest"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
        active
          ? "border-signal/40 text-signal"
          : "border-line text-muted hover:border-signal/60 hover:text-foreground"
      } ${className}`}
    >
      <Star className={`h-4 w-4 ${active ? "fill-current" : ""}`} aria-hidden="true" />
    </button>
  );
}
