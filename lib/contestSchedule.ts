import { after } from "next/server";
import {
  CONTEST_ADAPTERS,
  PLATFORM_META,
  getLiveContests,
  type Contest,
  type PlatformKey,
  type PlatformStats,
} from "./contestService";
import { getPool, isDatabaseConfigured } from "./db";
import {
  readContestsFromDb,
  readLastRefresh,
  readSourceHealth,
  recordSourceFailure,
  recordSourceSuccess,
  syncContestsForSource,
  type SourceHealth,
} from "./contestStore";
import { isCircuitOpen } from "./sourceCircuit";

const STALE_AFTER_MS = 15 * 60 * 1000;
let refreshScheduled = false;

function scheduleBackgroundRefresh(): void {
  if (refreshScheduled) return;
  refreshScheduled = true;

  try {
    after(async () => {
      try {
        await refreshContests();
      } catch (error) {
        console.error("[ContestSchedule] Background refresh failed:", error);
      } finally {
        refreshScheduled = false;
      }
    });
  } catch (error) {
    refreshScheduled = false;
    console.error("[ContestSchedule] Could not schedule background refresh:", error);
  }
}

export async function getUpcomingContests(): Promise<Contest[]> {
  if (isDatabaseConfigured()) {
    try {
      const stored = await readContestsFromDb();
      if (stored.length > 0) {
        try {
          const lastRefresh = await readLastRefresh();
          if (
            !lastRefresh ||
            Date.now() - new Date(lastRefresh).getTime() >= STALE_AFTER_MS
          ) {
            scheduleBackgroundRefresh();
          }
        } catch (error) {
          console.error("[ContestSchedule] Could not check schedule freshness:", error);
        }

        return stored;
      }
    } catch (error) {
      console.error(
        "[ContestSchedule] Database schedule read failed; using live adapters:",
        error,
      );
    }
  }

  return getLiveContests();
}

export async function getContestStats(): Promise<{
  totalContests: number;
  upcoming: number;
  active: number;
  platforms: PlatformStats[];
  next24h: number;
}> {
  const contests = await getUpcomingContests();
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcoming = contests.filter((contest) => new Date(contest.startTime) > now).length;
  const active = contests.filter(
    (contest) => new Date(contest.startTime) <= now && new Date(contest.endTime) >= now,
  ).length;
  const next24h = contests.filter((contest) => {
    const start = new Date(contest.startTime);
    return start > now && start <= in24h;
  }).length;

  const platforms = (Object.keys(PLATFORM_META) as PlatformKey[])
    .map((key) => {
      const platformContests = contests.filter((contest) => contest.platformKey === key);
      return {
        platform: PLATFORM_META[key].name,
        platformKey: key,
        totalContests: platformContests.length,
        upcoming: platformContests.filter((contest) => new Date(contest.startTime) > now).length,
        active: platformContests.filter(
          (contest) => new Date(contest.startTime) <= now && new Date(contest.endTime) >= now,
        ).length,
      };
    })
    .filter((platform) => platform.totalContests > 0);

  return {
    totalContests: contests.length,
    upcoming,
    active,
    platforms,
    next24h,
  };
}

export async function getContestById(id: string): Promise<Contest | null> {
  const contests = await getUpcomingContests();
  return (
    contests.find(
      (contest) =>
        String(contest.id) === String(id) ||
        `${contest.platformKey}:${contest.id}` === String(id),
    ) || null
  );
}

export async function getContestsByPlatform(platformKey: string): Promise<Contest[]> {
  const contests = await getUpcomingContests();
  const key = platformKey.toLowerCase() as PlatformKey;
  if (!(key in PLATFORM_META)) return contests;
  return contests.filter((contest) => contest.platformKey === key);
}

export type RefreshSourceResult = {
  source: PlatformKey;
  ok: boolean;
  count: number;
  latencyMs: number;
  error?: string;
};

async function acquireRefreshLock() {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const client = await getPool().connect();

  try {
    const result = await client.query<{ locked: boolean }>(
      "SELECT pg_try_advisory_lock(hashtext('contest_radar_refresh')) AS locked",
    );

    if (result.rows[0]?.locked) {
      return client;
    }
  } catch (error) {
    console.error("[ContestSchedule] Could not acquire refresh lock:", error);
  }

  client.release();
  return null;
}

export async function refreshContests(): Promise<RefreshSourceResult[]> {
  const lockClient = await acquireRefreshLock();

  if (isDatabaseConfigured() && !lockClient) {
    return [];
  }

  try {
    let healthBySource = new Map<string, SourceHealth>();

    if (isDatabaseConfigured()) {
      try {
        const health = await readSourceHealth();
        healthBySource = new Map(health.map((source) => [source.sourceKey, source]));
      } catch (error) {
        console.error("[ContestSchedule] Could not read source health:", error);
      }
    }

    return await Promise.all(
      CONTEST_ADAPTERS.map(async (adapter): Promise<RefreshSourceResult> => {
        if (isCircuitOpen(healthBySource.get(adapter.key))) {
          return {
            source: adapter.key,
            ok: false,
            count: 0,
            latencyMs: 0,
            error: "Circuit open; retrying after cooldown",
          };
        }

        const startedAt = Date.now();
        let contests: Contest[];

        try {
          contests = await adapter.run();
        } catch (error) {
          const latencyMs = Date.now() - startedAt;
          const message = error instanceof Error ? error.message : String(error);

          if (isDatabaseConfigured()) {
            try {
              await recordSourceFailure(adapter.key, message, latencyMs);
            } catch (dbError) {
              console.error(
                `[ContestSchedule] Failed to record ${adapter.key} health:`,
                dbError,
              );
            }
          }

          return { source: adapter.key, ok: false, count: 0, latencyMs, error: message };
        }

        const latencyMs = Date.now() - startedAt;

        if (isDatabaseConfigured()) {
          try {
            await syncContestsForSource(adapter.key, contests);
            await recordSourceSuccess(adapter.key, latencyMs, contests.length);
          } catch (dbError) {
            const message = dbError instanceof Error ? dbError.message : String(dbError);
            console.error(
              `[ContestSchedule] Failed to persist ${adapter.key} contests:`,
              dbError,
            );
            return {
              source: adapter.key,
              ok: false,
              count: contests.length,
              latencyMs,
              error: message,
            };
          }
        }

        return { source: adapter.key, ok: true, count: contests.length, latencyMs };
      }),
    );
  } finally {
    if (lockClient) {
      try {
        await lockClient.query("SELECT pg_advisory_unlock(hashtext('contest_radar_refresh'))");
      } catch (error) {
        console.error("[ContestSchedule] Could not release refresh lock:", error);
      }
      lockClient.release();
    }
  }
}
