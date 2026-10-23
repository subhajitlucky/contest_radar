export type ContestRecord = {
  platform: string;
  contestId: string;
  name: string;
  url: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  type: string;
  difficulty: string | null;
  participants: number | null;
  description: string | null;
  isActive: boolean;
};

export type ContestChangeType = "added" | "updated" | "removed";

export type ContestChange = {
  type: ContestChangeType;
  previous: ContestRecord | null;
  current: ContestRecord | null;
};

function sameRecord(first: ContestRecord, second: ContestRecord): boolean {
  return (
    first.name === second.name &&
    first.url === second.url &&
    first.startTime === second.startTime &&
    first.endTime === second.endTime &&
    first.durationMinutes === second.durationMinutes &&
    first.type === second.type &&
    first.difficulty === second.difficulty &&
    first.participants === second.participants &&
    first.description === second.description &&
    first.isActive === second.isActive
  );
}

export function diffContests(
  existing: ContestRecord[],
  incoming: ContestRecord[],
  now = new Date(),
): ContestChange[] {
  const existingById = new Map(existing.map((contest) => [contest.contestId, contest]));
  const seen = new Set<string>();
  const changes: ContestChange[] = [];

  for (const contest of incoming) {
    const previous = existingById.get(contest.contestId);
    seen.add(contest.contestId);

    if (!previous) {
      changes.push({ type: "added", previous: null, current: contest });
      continue;
    }

    if (!sameRecord(previous, contest)) {
      changes.push({ type: "updated", previous, current: contest });
    }
  }

  for (const contest of existing) {
    if (seen.has(contest.contestId)) continue;
    if (!contest.isActive) continue;
    if (new Date(contest.endTime).getTime() <= now.getTime()) continue;

    changes.push({ type: "removed", previous: contest, current: null });
  }

  return changes;
}
