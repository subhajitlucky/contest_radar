/**
 * Contest Service - Codeforces API Integration
 * Fetches real contest data from Codeforces API
 */

import { NextResponse } from 'next/server';

export interface CodeforcesContestAPI {
  id: number;
  name: string;
  type: string; // "CF", "Educational", "Div. 2", etc.
  phase: string; // "BEFORE", "CODING", "RENDERING", "FINISHED"
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds?: number;
  relativeTimeSeconds?: number;
  organization?: string;
}

export interface Contest {
  id: string | number;
  name: string;
  platform: "Codeforces";
  platformKey: "codeforces";
  startTime: string; // ISO format
  endTime: string;   // ISO format
  duration: number;  // in minutes
  type: string;      // "Div. 1", "Div. 2", "Educational", etc.
  difficulty?: string;
  participants?: number; // Estimated based on contest type
  description?: string;
  url: string;
  phase: string;
  isRegistrationOpen: boolean;
}

export interface PlatformStats {
  platform: string;
  totalContests: number;
  upcoming: number;
  active: number;
}

// Estimated participant counts based on contest type
const participantEstimates: Record<string, number> = {
  "Div. 1": 1500,
  "Div. 2": 8000,
  "Div. 3": 25000,
  "Div. 4": 35000,
  "Educational": 18000,
  "Global": 5000,
  "PinRound": 3000,
  "TypeScript": 2000,
  "Kotlin": 2000,
  "Good Bye": 10000,
};

// Difficulty mapping based on contest type
const difficultyMap: Record<string, string> = {
  "Div. 1": "Hard",
  "Div. 2": "Medium-Hard",
  "Div. 3": "Easy-Medium",
  "Div. 4": "Easy",
  "Educational": "Medium",
  "Global": "Medium-Hard",
  "PinRound": "Medium",
  "TypeScript": "Easy",
  "Kotlin": "Easy",
  "Good Bye": "Medium-Hard",
};

/**
 * Transform Codeforces API response to our Contest format
 */
function transformContest(apiContest: CodeforcesContestAPI): Contest | null {
  // Only return contests that have a start time (exclude ones that haven't been announced)
  if (!apiContest.startTimeSeconds) return null;

  const startTime = new Date(apiContest.startTimeSeconds * 1000);
  const endTime = new Date(startTime.getTime() + apiContest.durationSeconds * 1000);
  const now = new Date();

  // Skip finished contests
  if (endTime < now && apiContest.phase === "FINISHED") return null;

  // Determine contest type
  let type = apiContest.type;
  const name = apiContest.name;

  // Better type detection
  if (name.includes("Div. 1")) type = "Div. 1";
  else if (name.includes("Div. 2")) type = "Div. 2";
  else if (name.includes("Div. 3")) type = "Div. 3";
  else if (name.includes("Div. 4")) type = "Div. 4";
  else if (name.includes("Educational")) type = "Educational";
  else if (name.includes("Global")) type = "Global";
  else if (name.includes("Pin")) type = "PinRound";
  else if (name.includes("TypeScript")) type = "TypeScript";
  else if (name.includes("Kotlin")) type = "Kotlin";
  else if (name.includes("Good Bye") || name.includes("Goodbye")) type = "Good Bye";

  // Get difficulty
  const difficulty = difficultyMap[type] || "Unknown";

  // Estimate participants
  const participants = participantEstimates[type] || 5000;

  // Calculate registration status
  const isRegistrationOpen = startTime > now && (apiContest.phase === "BEFORE");

  // Duration in minutes
  const duration = Math.round(apiContest.durationSeconds / 60);

  return {
    id: apiContest.id,
    name: apiContest.name,
    platform: "Codeforces",
    platformKey: "codeforces",
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    duration,
    type,
    difficulty,
    participants,
    description: getContestDescription(type),
    url: `https://codeforces.com/contests`,
    phase: apiContest.phase,
    isRegistrationOpen
  };
}

/**
 * Get contest description based on type
 */
function getContestDescription(type: string): string {
  const descriptions: Record<string, string> = {
    "Div. 1": "Expert level contest for top rated coders",
    "Div. 2": "Intermediate level contest",
    "Div. 3": "Beginner friendly contest - great for warming up",
    "Div. 4": "Very beginner friendly - perfect for newcomers",
    "Educational": "Focuses on educational problems and techniques",
    "Global": "International contest with mixed difficulty",
    "PinRound": "Special themed contest",
    "TypeScript": "TypeScript practice contest",
    "Kotlin": "Kotlin programming contest",
    "Good Bye": "End-of-year special contest",
  };
  return descriptions[type] || "Standard Codeforces contest";
}

/**
 * Fetch all contests from Codeforces API
 */
export async function getUpcomingContests(): Promise<Contest[]> {
  try {
    // Fetch regular contests
    const response = await fetch('https://codeforces.com/api/contest.list?gym=false', {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'User-Agent': 'ContestRadar/1.0',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(`Codeforces API Error: ${data.result || data.comment || 'Unknown error'}`);
    }

    // Transform to our format
    const contests = data.result
      .map(transformContest)
      .filter((c: Contest | null): c is Contest => c !== null) // Filter out nulls
      .sort((a: Contest, b: Contest) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

    return contests;

  } catch (error) {
    console.error('[ContestService] Error fetching from Codeforces:', error);

    // Return fallback data with realistic contest times
    return getFallbackData();
  }
}

/**
 * Get stats from Codeforces data
 */
export async function getContestStats(): Promise<{
  totalContests: number;
  upcoming: number;
  active: number;
  platforms: PlatformStats[];
  next24h: number;
}> {
  try {
    const contests = await getUpcomingContests();
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcoming = contests.length;
    const next24h = contests.filter(c => {
      const start = new Date(c.startTime);
      return start > now && start <= in24h;
    }).length;

    const active = contests.filter(c => {
      const start = new Date(c.startTime);
      const end = new Date(c.endTime);
      return start <= now && end >= now;
    }).length;

    // Add historical data estimate
    const total = upcoming + 1500; // Would come from database

    return {
      totalContests: total,
      upcoming,
      active,
      platforms: [
        {
          platform: "Codeforces",
          totalContests: total,
          upcoming: upcoming,
          active: active
        }
      ],
      next24h
    };

  } catch (error) {
    console.error('[Stats] Error:', error);
    return {
      totalContests: 1500,
      upcoming: 5,
      active: 0,
      platforms: [
        { platform: "Codeforces", totalContests: 1500, upcoming: 5, active: 0 }
      ],
      next24h: 2
    };
  }
}

/**
 * Get single contest by ID
 */
export async function getContestById(id: string): Promise<Contest | null> {
  try {
    const contests = await getUpcomingContests();
    return contests.find(c => String(c.id) === String(id)) || null;
  } catch (error) {
    console.error('[ContestService] Error fetching contest by ID:', error);
    return null;
  }
}

/**
 * Get contests filtered by platform (for compatibility)
 */
export async function getContestsByPlatform(platformKey: string): Promise<Contest[]> {
  const contests = await getUpcomingContests();
  if (platformKey.toLowerCase() === 'codeforces') {
    return contests;
  }
  return [];
}

/**
 * Get available platforms
 */
export async function getAvailablePlatforms(): Promise<string[]> {
  return ["Codeforces"];
}

// HELPER FUNCTIONS

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
}

export function getRelativeTime(dateString: string): string {
  const now = new Date().getTime();
  const target = new Date(dateString).getTime();
  const diff = target - now;

  if (diff < 0) {
    if (diff < -3600000) return "Started";
    return "Started";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function getContestStatus(startTime: string, endTime: string): 'upcoming' | 'live' | 'ended' {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'live';
  return 'ended';
}

export function formatContestDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
}

/**
 * Fallback data when API is down
 * Uses realistic times (contests in next 1-7 days)
 */
function getFallbackData(): Contest[] {
  const now = new Date();

  // Generate realistic contests for next week
  return [
    {
      id: "fallback_1",
      name: "Codeforces Div. 3 #900",
      platform: "Codeforces",
      platformKey: "codeforces",
      startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(),
      duration: 120,
      type: "Div. 3",
      difficulty: "Easy",
      participants: 25000,
      description: "Beginner friendly contest - great for warming up",
      url: "https://codeforces.com/contests",
      phase: "BEFORE",
      isRegistrationOpen: true
    },
    {
      id: "fallback_2",
      name: "Codeforces Educational Round #160",
      platform: "Codeforces",
      platformKey: "codeforces",
      startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 135 * 60 * 1000).toISOString(),
      duration: 135,
      type: "Educational",
      difficulty: "Medium",
      participants: 18000,
      description: "Focuses on educational problems and techniques",
      url: "https://codeforces.com/contests",
      phase: "BEFORE",
      isRegistrationOpen: true
    },
    {
      id: "fallback_3",
      name: "Codeforces Div. 2 #750",
      platform: "Codeforces",
      platformKey: "codeforces",
      startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 150 * 60 * 1000).toISOString(),
      duration: 150,
      type: "Div. 2",
      difficulty: "Medium-Hard",
      participants: 8000,
      description: "Intermediate contestant level",
      url: "https://codeforces.com/contests",
      phase: "BEFORE",
      isRegistrationOpen: true
    }
  ];
}

/**
 * Fetch gym contests (optional)
 */
export async function getGymContests(): Promise<Contest[]> {
  try {
    const response = await fetch('https://codeforces.com/api/contest.list?gym=true', {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: { 'User-Agent': 'ContestRadar/1.0' }
    });

    const data = await response.json();

    if (data.status !== "OK") throw new Error("API Error");

    return data.result
      .map(transformContest)
      .filter((c: Contest | null): c is Contest => c !== null)
      .slice(0, 10); // Return top 10 recent gyms

  } catch (error) {
    console.error('[Gym] Unable to fetch gym contests:', error);
    return [];
  }
}