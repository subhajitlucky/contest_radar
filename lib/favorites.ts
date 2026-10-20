import type { Contest } from "@/lib/contestService";

export const FAVORITES_KEY = "cr-favorites:v1";
export const FAVORITES_EVENT = "cr-favorites-updated";

export function contestKey(contest: Pick<Contest, "platformKey" | "id">): string {
  return `${contest.platformKey}:${contest.id}`;
}

export function parseFavorites(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function getFavoritesSnapshot(): string {
  try {
    return window.localStorage.getItem(FAVORITES_KEY) ?? "";
  } catch {
    return "";
  }
}

export function subscribeFavorites(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(FAVORITES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(FAVORITES_EVENT, callback);
  };
}

export function toggleFavorite(key: string): void {
  const current = parseFavorites(getFavoritesSnapshot());
  const next = current.includes(key) ? current.filter((item) => item !== key) : [...current, key];

  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  } catch {
    // Storage can be unavailable; the rest of the interface stays usable.
  }
}
