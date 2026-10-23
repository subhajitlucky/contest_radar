import { describe, expect, it } from "vitest";
import { diffContests, type ContestRecord } from "./contestDiff";

const now = new Date("2026-10-23T00:00:00.000Z");

const base: ContestRecord = {
  platform: "codeforces",
  contestId: "1001",
  name: "Codeforces Round 1001",
  url: "https://codeforces.com/contest/1001",
  startTime: "2026-10-24T14:35:00.000Z",
  endTime: "2026-10-24T16:35:00.000Z",
  durationMinutes: 120,
  type: "Div. 2",
  difficulty: "Medium-Hard",
  participants: 8000,
  description: "Intermediate contestant level",
  isActive: true,
};

describe("diffContests", () => {
  it("marks a new contest as added", () => {
    expect(diffContests([], [base], now)).toEqual([
      { type: "added", previous: null, current: base },
    ]);
  });

  it("marks a changed contest as updated", () => {
    const moved = { ...base, startTime: "2026-10-24T15:35:00.000Z" };
    expect(diffContests([base], [moved], now)).toEqual([
      { type: "updated", previous: base, current: moved },
    ]);
  });

  it("ignores unchanged contests", () => {
    expect(diffContests([base], [base], now)).toEqual([]);
  });

  it("marks a disappeared future contest as removed", () => {
    expect(diffContests([base], [], now)).toEqual([
      { type: "removed", previous: base, current: null },
    ]);
  });

  it("does not remove a contest that has already ended", () => {
    const past = { ...base, endTime: "2026-10-22T16:35:00.000Z" };
    expect(diffContests([past], [], now)).toEqual([]);
  });

  it("treats a reactivated contest as updated", () => {
    const inactive = { ...base, isActive: false };
    expect(diffContests([inactive], [base], now)).toEqual([
      { type: "updated", previous: inactive, current: base },
    ]);
  });
});
