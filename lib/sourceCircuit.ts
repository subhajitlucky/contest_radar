import type { SourceHealth } from "./contestStore";

export const CIRCUIT_FAILURE_THRESHOLD = 5;
export const CIRCUIT_COOLDOWN_MS = 15 * 60 * 1000;

export function isCircuitOpen(
  source: SourceHealth | undefined,
  now = Date.now(),
): boolean {
  if (!source) return false;
  if (source.consecutiveFailures < CIRCUIT_FAILURE_THRESHOLD) return false;
  if (!source.lastAttemptAt) return false;

  const lastAttempt = new Date(source.lastAttemptAt).getTime();
  if (!Number.isFinite(lastAttempt)) return false;

  return now - lastAttempt < CIRCUIT_COOLDOWN_MS;
}
