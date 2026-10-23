export type PlatformKey =
  | "codeforces"
  | "leetcode"
  | "codechef"
  | "atcoder"
  | "hackerrank";

export type PlatformName =
  | "Codeforces"
  | "LeetCode"
  | "CodeChef"
  | "AtCoder"
  | "HackerRank";

export const PLATFORM_META: Record<PlatformKey, { name: PlatformName; url: string }> = {
  codeforces: { name: "Codeforces", url: "https://codeforces.com/contests" },
  leetcode: { name: "LeetCode", url: "https://leetcode.com/contest/" },
  codechef: { name: "CodeChef", url: "https://www.codechef.com/contests" },
  atcoder: { name: "AtCoder", url: "https://atcoder.jp/contests/" },
  hackerrank: { name: "HackerRank", url: "https://www.hackerrank.com/contests" },
};

export interface Contest {
  id: string | number;
  name: string;
  platform: PlatformName;
  platformKey: PlatformKey;
  startTime: string;
  endTime: string;
  duration: number;
  type: string;
  difficulty?: string;
  participants?: number;
  description?: string;
  url: string;
  phase: string;
  isRegistrationOpen: boolean;
}

export interface PlatformStats {
  platform: PlatformName;
  platformKey: PlatformKey;
  totalContests: number;
  upcoming: number;
  active: number;
}
