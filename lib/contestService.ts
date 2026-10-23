import {
  PLATFORM_META,
  type Contest,
  type PlatformKey,
  type PlatformName,
} from "./contestTypes";

export { PLATFORM_META } from "./contestTypes";
export type { Contest, PlatformKey, PlatformName, PlatformStats } from "./contestTypes";

export interface CodeforcesContestAPI {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds?: number;
  relativeTimeSeconds?: number;
  organization?: string;
}

const participantEstimates: Record<string, number> = {
  "Div. 1": 1500,
  "Div. 2": 8000,
  "Div. 3": 25000,
  "Div. 4": 35000,
  Educational: 18000,
  Global: 5000,
  PinRound: 3000,
  TypeScript: 2000,
  Kotlin: 2000,
  "Good Bye": 10000,
};

const difficultyMap: Record<string, string> = {
  "Div. 1": "Hard",
  "Div. 2": "Medium-Hard",
  "Div. 3": "Easy-Medium",
  "Div. 4": "Easy",
  Educational: "Medium",
  Global: "Medium-Hard",
  PinRound: "Medium",
  TypeScript: "Easy",
  Kotlin: "Easy",
  "Good Bye": "Medium-Hard",
};

function contestPhase(start: Date, end: Date, now: Date): "BEFORE" | "CODING" | "FINISHED" {
  if (now < start) return "BEFORE";
  if (now <= end) return "CODING";
  return "FINISHED";
}

function codeforcesType(apiContest: CodeforcesContestAPI): string {
  const name = apiContest.name;
  if (name.includes("Div. 1")) return "Div. 1";
  if (name.includes("Div. 2")) return "Div. 2";
  if (name.includes("Div. 3")) return "Div. 3";
  if (name.includes("Div. 4")) return "Div. 4";
  if (name.includes("Educational")) return "Educational";
  if (name.includes("Global")) return "Global";
  if (name.includes("Pin")) return "PinRound";
  if (name.includes("TypeScript")) return "TypeScript";
  if (name.includes("Kotlin")) return "Kotlin";
  if (name.includes("Good Bye") || name.includes("Goodbye")) return "Good Bye";
  return apiContest.type || "Contest";
}

function codeforcesDescription(type: string): string {
  const descriptions: Record<string, string> = {
    "Div. 1": "Expert level contest for top rated coders",
    "Div. 2": "Intermediate level contest",
    "Div. 3": "Beginner friendly contest - great for warming up",
    "Div. 4": "Very beginner friendly - perfect for newcomers",
    Educational: "Focuses on educational problems and techniques",
    Global: "International contest with mixed difficulty",
    PinRound: "Special themed contest",
    TypeScript: "TypeScript practice contest",
    Kotlin: "Kotlin programming contest",
    "Good Bye": "End-of-year special contest",
  };
  return descriptions[type] || "Standard Codeforces contest";
}

function transformCodeforces(apiContest: CodeforcesContestAPI): Contest | null {
  if (!apiContest.startTimeSeconds) return null;

  const start = new Date(apiContest.startTimeSeconds * 1000);
  const end = new Date(start.getTime() + apiContest.durationSeconds * 1000);
  const now = new Date();
  if (end < now) return null;

  const type = codeforcesType(apiContest);

  return {
    id: apiContest.id,
    name: apiContest.name,
    platform: "Codeforces",
    platformKey: "codeforces",
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    duration: Math.round(apiContest.durationSeconds / 60),
    type,
    difficulty: difficultyMap[type] || "Unknown",
    participants: participantEstimates[type] || 5000,
    description: codeforcesDescription(type),
    url: `https://codeforces.com/contest/${apiContest.id}`,
    phase: contestPhase(start, end, now),
    isRegistrationOpen: start > now,
  };
}

async function fetchCodeforces(): Promise<Contest[]> {
  const response = await fetch("https://codeforces.com/api/contest.list?gym=false", {
    next: { revalidate: 300 },
    headers: { "User-Agent": "ContestRadar/1.0" },
  });

  if (!response.ok) {
    throw new Error(`Codeforces HTTP ${response.status}`);
  }

  const data = await response.json();
  if (data.status !== "OK") {
    throw new Error(`Codeforces API error: ${data.comment || "unknown"}`);
  }

  return (data.result as CodeforcesContestAPI[])
    .map(transformCodeforces)
    .filter((contest): contest is Contest => contest !== null);
}

interface LeetCodeContest {
  title: string;
  titleSlug: string;
  startTime: number;
  duration: number;
}

async function fetchLeetCode(): Promise<Contest[]> {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    next: { revalidate: 300 },
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "ContestRadar/1.0",
    },
    body: JSON.stringify({
      query: "query { upcomingContests { title titleSlug startTime duration } }",
    }),
  });

  if (!response.ok) {
    throw new Error(`LeetCode HTTP ${response.status}`);
  }

  const payload = await response.json();
  const contests = (payload?.data?.upcomingContests ?? []) as LeetCodeContest[];
  const now = new Date();

  return contests
    .map((item): Contest | null => {
      if (!item.startTime || !item.duration) return null;
      const start = new Date(item.startTime * 1000);
      const end = new Date(start.getTime() + item.duration * 1000);
      if (end < now) return null;

      const type = item.title.toLowerCase().includes("biweekly") ? "Biweekly" : "Weekly";

      return {
        id: item.titleSlug,
        name: item.title,
        platform: "LeetCode",
        platformKey: "leetcode",
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        duration: Math.round(item.duration / 60),
        type,
        description: "LeetCode rated contest",
        url: `https://leetcode.com/contest/${item.titleSlug}/`,
        phase: contestPhase(start, end, now),
        isRegistrationOpen: start > now,
      };
    })
    .filter((contest): contest is Contest => contest !== null);
}

interface CodeChefContest {
  contest_id: string;
  contest_code: string;
  contest_name: string;
  contest_start_date_iso?: string;
  contest_end_date_iso?: string;
  contest_duration?: string;
}

async function fetchCodeChef(): Promise<Contest[]> {
  const response = await fetch(
    "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&limit=30",
    {
      next: { revalidate: 300 },
      headers: { "User-Agent": "ContestRadar/1.0" },
    }
  );

  if (!response.ok) {
    throw new Error(`CodeChef HTTP ${response.status}`);
  }

  const payload = await response.json();
  const contests = [
    ...(payload?.present_contests ?? []),
    ...(payload?.future_contests ?? []),
  ] as CodeChefContest[];
  const now = new Date();

  return contests
    .map((item): Contest | null => {
      if (!item.contest_start_date_iso || !item.contest_end_date_iso) return null;
      const start = new Date(item.contest_start_date_iso);
      const end = new Date(item.contest_end_date_iso);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
      if (end < now) return null;

      const type = item.contest_name.toLowerCase().includes("starters") ? "Starters" : "Contest";

      return {
        id: item.contest_id,
        name: item.contest_name,
        platform: "CodeChef",
        platformKey: "codechef",
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        duration: Number(item.contest_duration) || Math.round((end.getTime() - start.getTime()) / 60000),
        type,
        description: "CodeChef contest",
        url: "https://www.codechef.com/contests",
        phase: contestPhase(start, end, now),
        isRegistrationOpen: start > now,
      };
    })
    .filter((contest): contest is Contest => contest !== null);
}

interface AtCoderContest {
  id: string;
  start_epoch_second: number;
  duration_second: number;
  title: string;
}

function atCoderType(id: string): string {
  if (id.startsWith("abc")) return "ABC";
  if (id.startsWith("arc")) return "ARC";
  if (id.startsWith("agc")) return "AGC";
  if (id.startsWith("ahc")) return "AHC";
  return "Contest";
}

async function fetchAtCoderJson(): Promise<Contest[]> {
  const response = await fetch("https://kenkoooo.com/atcoder/resources/contests.json", {
    next: { revalidate: 3600 },
    headers: { "User-Agent": "ContestRadar/1.0" },
  });

  if (!response.ok) {
    throw new Error(`AtCoder HTTP ${response.status}`);
  }

  const contests = (await response.json()) as AtCoderContest[];
  const now = new Date();
  const maxDuration = 7 * 24 * 60 * 60;

  return contests
    .filter((item) => {
      if (!item.start_epoch_second || !item.duration_second) return false;
      if (item.duration_second > maxDuration) return false;
      if (item.id.startsWith("APG4b") || item.id.startsWith("practice")) return false;
      if (item.title.toLowerCase().includes("daily training")) return false;
      return item.start_epoch_second * 1000 + item.duration_second * 1000 >= now.getTime();
    })
    .map((item): Contest => {
      const start = new Date(item.start_epoch_second * 1000);
      const end = new Date(start.getTime() + item.duration_second * 1000);
      const type = atCoderType(item.id);

      return {
        id: item.id,
        name: item.title,
        platform: "AtCoder",
        platformKey: "atcoder",
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        duration: Math.round(item.duration_second / 60),
        type,
        description: "AtCoder contest",
        url: `https://atcoder.jp/contests/${item.id}`,
        phase: contestPhase(start, end, now),
        isRegistrationOpen: start > now,
      };
    });
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function fetchAtCoderHtml(): Promise<Contest[]> {
  const response = await fetch("https://atcoder.jp/contests/", {
    next: { revalidate: 1800 },
    headers: { "User-Agent": "ContestRadar/1.0" },
  });

  if (!response.ok) {
    throw new Error(`AtCoder HTML HTTP ${response.status}`);
  }

  const html = await response.text();
  const now = new Date();
  const rows =
    /<tr>[\s\S]*?<time class='fixtime fixtime-full'>([^<]+)<\/time>[\s\S]*?<a href="\/contests\/([^"]+)">([^<]+)<\/a>[\s\S]*?<td class="text-center">(\d{1,2}):(\d{2})<\/td>[\s\S]*?<\/tr>/g;

  const contests: Contest[] = [];
  const seen = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = rows.exec(html)) !== null) {
    const [, dateText, id, title, hours, minutes] = match;
    if (id === "practice" || id.startsWith("practice") || seen.has(id)) continue;

    const iso = dateText.replace(" ", "T").replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
    const start = new Date(iso);
    if (Number.isNaN(start.getTime())) continue;

    const duration = Number(hours) * 60 + Number(minutes);
    const end = new Date(start.getTime() + duration * 60 * 1000);
    if (end < now) continue;

    seen.add(id);
    contests.push({
      id,
      name: decodeHtml(title),
      platform: "AtCoder",
      platformKey: "atcoder",
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration,
      type: atCoderType(id),
      description: "AtCoder contest",
      url: `https://atcoder.jp/contests/${id}`,
      phase: contestPhase(start, end, now),
      isRegistrationOpen: start > now,
    });
  }

  return contests;
}

async function fetchAtCoder(): Promise<Contest[]> {
  const jsonContests = await fetchAtCoderJson();
  if (jsonContests.length > 0) return jsonContests;

  return fetchAtCoderHtml();
}

interface HackerRankContest {
  id: number;
  name: string;
  slug: string;
  epoch_starttime: number;
  epoch_endtime: number;
  ended: boolean;
  rated: boolean;
}

async function fetchHackerRank(): Promise<Contest[]> {
  const response = await fetch(
    "https://www.hackerrank.com/rest/contests/upcoming?limit=25&offset=0",
    {
      next: { revalidate: 300 },
      headers: { "User-Agent": "ContestRadar/1.0" },
    }
  );

  if (!response.ok) {
    throw new Error(`HackerRank HTTP ${response.status}`);
  }

  const payload = await response.json();
  const contests = (payload?.models ?? []) as HackerRankContest[];
  const now = new Date();

  return contests
    .filter((item) => !item.ended && item.epoch_starttime > 0 && item.epoch_endtime > 0)
    .map((item): Contest | null => {
      const start = new Date(item.epoch_starttime * 1000);
      const end = new Date(item.epoch_endtime * 1000);
      if (end < now) return null;

      return {
        id: item.id,
        name: item.name,
        platform: "HackerRank",
        platformKey: "hackerrank",
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        duration: Math.round((end.getTime() - start.getTime()) / 60000),
        type: item.rated ? "Rated" : "Contest",
        description: "HackerRank contest",
        url: `https://www.hackerrank.com/contests/${item.slug}`,
        phase: contestPhase(start, end, now),
        isRegistrationOpen: start > now,
      };
    })
    .filter((contest): contest is Contest => contest !== null);
}

export const CONTEST_ADAPTERS: Array<{ key: PlatformKey; run: () => Promise<Contest[]> }> = [
  { key: "codeforces", run: fetchCodeforces },
  { key: "leetcode", run: fetchLeetCode },
  { key: "codechef", run: fetchCodeChef },
  { key: "atcoder", run: fetchAtCoder },
  { key: "hackerrank", run: fetchHackerRank },
];

export async function getLiveContests(): Promise<Contest[]> {
  const results = await Promise.allSettled(CONTEST_ADAPTERS.map((adapter) => adapter.run()));
  const contests = results.flatMap((result, index) => {
    if (result.status === "fulfilled") return result.value;
    console.error(`[ContestService] ${CONTEST_ADAPTERS[index].key} adapter failed:`, result.reason);
    return [];
  });

  if (contests.length === 0) {
    return getFallbackData();
  }

  const seen = new Set<string>();
  const deduped = contests.filter((contest) => {
    const key = `${contest.platformKey}:${contest.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
}

export async function getAvailablePlatforms(): Promise<string[]> {
  return Object.values(PLATFORM_META).map((platform) => platform.name);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins > 0) return `${hours}h ${mins}m`;
  return hours === 1 ? "1 hour" : `${hours} hours`;
}

export function getRelativeTime(dateString: string): string {
  const now = new Date().getTime();
  const target = new Date(dateString).getTime();
  const diff = target - now;

  if (diff < 0) return "Started";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function getContestStatus(startTime: string, endTime: string): "upcoming" | "live" | "ended" {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "live";
  return "ended";
}

const IST = "Asia/Kolkata";

export function formatContestDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: IST,
  })} IST`;
}

export function formatISTDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    timeZone: IST,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatISTTime(dateString: string): string {
  return new Date(dateString)
    .toLocaleTimeString("en-IN", {
      timeZone: IST,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
}

export function istDayKey(dateString: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(dateString));
}

function toCalendarDate(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export function getGoogleCalendarUrl(contest: Contest): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${contest.name} (${contest.platform})`,
    dates: `${toCalendarDate(contest.startTime)}/${toCalendarDate(contest.endTime)}`,
    details: `${contest.platform} contest · ${contest.url}`,
    location: contest.url,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function getFallbackData(): Contest[] {
  const now = new Date();

  const make = (
    id: string,
    name: string,
    type: string,
    offsetHours: number,
    durationMinutes: number,
    difficulty: string,
    participants: number,
    description: string,
    platform: PlatformName = "Codeforces",
    platformKey: PlatformKey = "codeforces"
  ): Contest => {
    const start = new Date(now.getTime() + offsetHours * 60 * 60 * 1000);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    return {
      id,
      name,
      platform,
      platformKey,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration: durationMinutes,
      type,
      difficulty,
      participants,
      description,
      url: platformKey === "codeforces" ? "https://codeforces.com/contests" : PLATFORM_META[platformKey].url,
      phase: "BEFORE",
      isRegistrationOpen: true,
    };
  };

  return [
    make(
      "fallback_1",
      "Codeforces Div. 3 #900",
      "Div. 3",
      2,
      120,
      "Easy",
      25000,
      "Beginner friendly contest - great for warming up"
    ),
    make(
      "fallback_2",
      "Codeforces Educational Round #160",
      "Educational",
      24,
      135,
      "Medium",
      18000,
      "Focuses on educational problems and techniques"
    ),
    make(
      "fallback_3",
      "Codeforces Div. 2 #750",
      "Div. 2",
      48,
      150,
      "Medium-Hard",
      8000,
      "Intermediate contestant level"
    ),
  ];
}

export async function getGymContests(): Promise<Contest[]> {
  try {
    const response = await fetch("https://codeforces.com/api/contest.list?gym=true", {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "ContestRadar/1.0" },
    });

    const data = await response.json();
    if (data.status !== "OK") throw new Error("Codeforces gym API error");

    return (data.result as CodeforcesContestAPI[])
      .map(transformCodeforces)
      .filter((contest): contest is Contest => contest !== null)
      .slice(0, 10);
  } catch (error) {
    console.error("[Gym] Unable to fetch gym contests:", error);
    return [];
  }
}

export async function getPastContests(limit = 30): Promise<Contest[]> {
  try {
    const response = await fetch("https://codeforces.com/api/contest.list?gym=false", {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "ContestRadar/1.0" },
    });

    if (!response.ok) throw new Error(`Codeforces HTTP ${response.status}`);
    const data = await response.json();
    if (data.status !== "OK") throw new Error("Codeforces API error");

    return (data.result as CodeforcesContestAPI[])
      .filter(
        (contest) =>
          contest.phase === "FINISHED" &&
          Boolean(contest.startTimeSeconds) &&
          contest.durationSeconds > 0
      )
      .sort((a, b) => (b.startTimeSeconds ?? 0) - (a.startTimeSeconds ?? 0))
      .slice(0, limit)
      .map((contest): Contest => {
        const start = new Date((contest.startTimeSeconds ?? 0) * 1000);
        const end = new Date(start.getTime() + contest.durationSeconds * 1000);
        const type = codeforcesType(contest);

        return {
          id: contest.id,
          name: contest.name,
          platform: "Codeforces",
          platformKey: "codeforces",
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          duration: Math.round(contest.durationSeconds / 60),
          type,
          difficulty: difficultyMap[type] || "Unknown",
          description: codeforcesDescription(type),
          url: `https://codeforces.com/contest/${contest.id}`,
          phase: "FINISHED",
          isRegistrationOpen: false,
        };
      });
  } catch (error) {
    console.error("[PastContests] failed:", error);
    return [];
  }
}
