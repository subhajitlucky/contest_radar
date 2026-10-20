function isoWeekKeyFromDate(date: Date): string {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function weekKeyFromTimestamp(timestampSeconds: number): string {
  return isoWeekKeyFromDate(new Date(timestampSeconds * 1000));
}

function previousWeekKey(key: string): string {
  const [yearText, weekText] = key.split("-W");
  let year = Number(yearText);
  let week = Number(weekText) - 1;
  if (week < 1) {
    year -= 1;
    week = 52;
  }
  return `${year}-W${String(week).padStart(2, "0")}`;
}

export function getWeekStreaks(timestamps: number[]): { current: number; longest: number } {
  if (timestamps.length === 0) return { current: 0, longest: 0 };

  const keys = [...new Set(timestamps.map(weekKeyFromTimestamp))].sort();
  let longest = 1;
  let run = 1;

  for (let i = 1; i < keys.length; i += 1) {
    const expected = previousWeekKey(keys[i]);
    if (keys[i - 1] === expected) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  const present = new Set(keys);
  let cursor = isoWeekKeyFromDate(new Date());
  if (!present.has(cursor)) cursor = previousWeekKey(cursor);

  let current = 0;
  while (present.has(cursor)) {
    current += 1;
    cursor = previousWeekKey(cursor);
  }

  return { current, longest: Math.max(longest, current) };
}
