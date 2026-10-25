import {
  CONTEST_ADAPTERS,
  PLATFORM_META,
  getLiveContests,
  type Contest,
  type PlatformKey,
  type PlatformStats,
} from "./contestService";
import { isDatabaseConfigured } from "./db";
import {
  readContestsFromDb,
  readSourceHealth,
  recordSourceFailure,
  recordSourceSuccess,
  syncContestsForSource,
  type SourceHealth,
} from "./contestStore";
import { isCircuitOpen } from "./sourceCircuit";

export async function getUpcomingContests(): Promise<Contest[]> {
  if (isDatabaseConfigured()) {
    try {
      const stored = await readContestsFromDb();
      if (stored.length > 0) {
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

export async function refreshContests(): Promise<RefreshSourceResult[]> {
  let healthBySource = new Map<string, SourceHealth>();

  if (isDatabaseConfigured()) {
    try {
      const health = await readSourceHealth();
      healthBySource = new Map(health.map((source) => [source.sourceKey, source]));
    } catch (error) {
      console.error("[ContestSchedule] Could not read source health:", error);
    }
  }

  return Promise.all(
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
            console.error(`[ContestSchedule] Failed to record ${adapter.key} health:`, dbError);
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
          console.error(`[ContestSchedule] Failed to persist ${adapter.key} contests:`, dbError);
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
}
