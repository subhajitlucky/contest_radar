import { getPool, isDatabaseConfigured } from "./db";
import { PLATFORM_META, type Contest, type PlatformKey, type PlatformName } from "./contestTypes";
import { diffContests, type ContestRecord } from "./contestDiff";

type ContestRow = {
  platform: string;
  contest_id: string;
  name: string;
  url: string;
  start_time: Date | string;
  end_time: Date | string;
  duration_minutes: number;
  type: string;
  difficulty: string | null;
  participants: number | null;
  description: string | null;
  is_active: boolean;
};

type SourceHealthRow = {
  source_key: string;
  last_attempt_at: Date | string | null;
  last_success_at: Date | string | null;
  last_error_at: Date | string | null;
  last_error: string | null;
  latency_ms: number | null;
  last_contest_count: number | null;
  consecutive_failures: number;
  updated_at: Date | string | null;
};

export type SourceHealth = {
  sourceKey: string;
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  lastErrorAt: string | null;
  lastError: string | null;
  latencyMs: number | null;
  lastContestCount: number | null;
  consecutiveFailures: number;
  updatedAt: string | null;
};

function iso(value: Date | string): string {
  return new Date(value).toISOString();
}

function toRecord(row: ContestRow): ContestRecord {
  return {
    platform: row.platform,
    contestId: row.contest_id,
    name: row.name,
    url: row.url,
    startTime: iso(row.start_time),
    endTime: iso(row.end_time),
    durationMinutes: row.duration_minutes,
    type: row.type,
    difficulty: row.difficulty,
    participants: row.participants,
    description: row.description,
    isActive: row.is_active,
  };
}

function fromContest(contest: Contest, platform: PlatformKey): ContestRecord {
  return {
    platform,
    contestId: String(contest.id),
    name: contest.name,
    url: contest.url,
    startTime: new Date(contest.startTime).toISOString(),
    endTime: new Date(contest.endTime).toISOString(),
    durationMinutes: Math.round(contest.duration),
    type: contest.type || "Contest",
    difficulty: contest.difficulty ?? null,
    participants: contest.participants ?? null,
    description: contest.description ?? null,
    isActive: true,
  };
}

function toContest(row: ContestRow): Contest {
  const platformKey = row.platform as PlatformKey;
  const meta = PLATFORM_META[platformKey];
  const start = new Date(row.start_time);
  const end = new Date(row.end_time);
  const now = new Date();

  return {
    id: row.contest_id,
    name: row.name,
    platform: meta?.name ?? (row.platform as PlatformName),
    platformKey,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    duration: row.duration_minutes,
    type: row.type,
    difficulty: row.difficulty ?? undefined,
    participants: row.participants ?? undefined,
    description: row.description ?? undefined,
    url: row.url,
    phase: now < start ? "BEFORE" : now <= end ? "CODING" : "FINISHED",
    isRegistrationOpen: start > now,
  };
}

export async function readContestsFromDb(): Promise<Contest[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const result = await getPool().query<ContestRow>(
    `SELECT platform, contest_id, name, url, start_time, end_time,
            duration_minutes, type, difficulty, participants, description, is_active
       FROM contests
      WHERE is_active = TRUE
        AND end_time >= NOW()
      ORDER BY start_time ASC`,
  );

  return result.rows.map(toContest);
}

export async function readSourceHealth(): Promise<SourceHealth[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const result = await getPool().query<SourceHealthRow>(
    `SELECT source_key, last_attempt_at, last_success_at, last_error_at, last_error,
            latency_ms, last_contest_count, consecutive_failures, updated_at
       FROM source_health
      ORDER BY source_key`,
  );

  return result.rows.map((row) => ({
    sourceKey: row.source_key,
    lastAttemptAt: row.last_attempt_at ? iso(row.last_attempt_at) : null,
    lastSuccessAt: row.last_success_at ? iso(row.last_success_at) : null,
    lastErrorAt: row.last_error_at ? iso(row.last_error_at) : null,
    lastError: row.last_error,
    latencyMs: row.latency_ms,
    lastContestCount: row.last_contest_count,
    consecutiveFailures: row.consecutive_failures,
    updatedAt: row.updated_at ? iso(row.updated_at) : null,
  }));
}

export async function syncContestsForSource(
  platform: PlatformKey,
  contests: Contest[],
): Promise<void> {
  if (!isDatabaseConfigured()) {
    return;
  }

  const incoming = Array.from(
    new Map(
      contests.map((contest) => [String(contest.id), fromContest(contest, platform)]),
    ).values(),
  );

  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    const existingResult = await client.query<ContestRow>(
      `SELECT platform, contest_id, name, url, start_time, end_time,
              duration_minutes, type, difficulty, participants, description, is_active
         FROM contests
        WHERE platform = $1`,
      [platform],
    );
    const existing = existingResult.rows.map(toRecord);

    // An empty response is ambiguous (no upcoming contests vs. a silent source
    // failure), so never deactivate the last-known schedule on an empty refresh.
    const changes = diffContests(existing, incoming).filter(
      (change) => change.type !== "removed" || incoming.length > 0,
    );

    for (const record of incoming) {
      await client.query(
        `INSERT INTO contests (
           platform, contest_id, name, url, start_time, end_time, duration_minutes,
           type, difficulty, participants, description, is_active,
           first_seen_at, last_seen_at, updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE, NOW(), NOW(), NOW())
         ON CONFLICT (platform, contest_id) DO UPDATE SET
           name = EXCLUDED.name,
           url = EXCLUDED.url,
           start_time = EXCLUDED.start_time,
           end_time = EXCLUDED.end_time,
           duration_minutes = EXCLUDED.duration_minutes,
           type = EXCLUDED.type,
           difficulty = EXCLUDED.difficulty,
           participants = EXCLUDED.participants,
           description = EXCLUDED.description,
           is_active = TRUE,
           last_seen_at = NOW(),
           updated_at = NOW()`,
        [
          platform,
          record.contestId,
          record.name,
          record.url,
          record.startTime,
          record.endTime,
          record.durationMinutes,
          record.type,
          record.difficulty,
          record.participants,
          record.description,
        ],
      );
    }

    for (const change of changes) {
      if (change.type === "removed" && change.previous) {
        await client.query(
          `UPDATE contests
              SET is_active = FALSE, updated_at = NOW()
            WHERE platform = $1 AND contest_id = $2`,
          [platform, change.previous.contestId],
        );
      }

      await client.query(
        `INSERT INTO contest_snapshots (platform, contest_id, change_type, previous, current)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          platform,
          change.previous?.contestId ?? change.current?.contestId,
          change.type,
          change.previous ? JSON.stringify(change.previous) : null,
          change.current ? JSON.stringify(change.current) : null,
        ],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function recordSourceSuccess(
  source: PlatformKey,
  latencyMs: number,
  contestCount: number,
): Promise<void> {
  if (!isDatabaseConfigured()) {
    return;
  }

  await getPool().query(
    `INSERT INTO source_health (
       source_key, last_attempt_at, last_success_at, latency_ms, last_contest_count,
       last_error, consecutive_failures, updated_at
     ) VALUES ($1, NOW(), NOW(), $2, $3, NULL, 0, NOW())
     ON CONFLICT (source_key) DO UPDATE SET
       last_attempt_at = NOW(),
       last_success_at = NOW(),
       latency_ms = EXCLUDED.latency_ms,
       last_contest_count = EXCLUDED.last_contest_count,
       last_error = NULL,
       consecutive_failures = 0,
       updated_at = NOW()`,
    [source, latencyMs, contestCount],
  );
}

export async function recordSourceFailure(
  source: PlatformKey,
  error: string,
  latencyMs: number,
): Promise<void> {
  if (!isDatabaseConfigured()) {
    return;
  }

  await getPool().query(
    `INSERT INTO source_health (
       source_key, last_attempt_at, last_error_at, last_error, latency_ms,
       consecutive_failures, updated_at
     ) VALUES ($1, NOW(), NOW(), $2, $3, 1, NOW())
     ON CONFLICT (source_key) DO UPDATE SET
       last_attempt_at = NOW(),
       last_error_at = NOW(),
       last_error = EXCLUDED.last_error,
       latency_ms = EXCLUDED.latency_ms,
       consecutive_failures = source_health.consecutive_failures + 1,
       updated_at = NOW()`,
    [source, error.slice(0, 1000), latencyMs],
  );
}
