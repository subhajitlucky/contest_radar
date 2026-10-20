import { describe, expect, it } from "vitest";
import { getWeekStreaks } from "./streak";

describe("getWeekStreaks", () => {
  it("returns zero for an empty history", () => {
    expect(getWeekStreaks([])).toEqual({ current: 0, longest: 0 });
  });

  it("counts consecutive weeks ending now", () => {
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;
    const timestamps = [now, now - week, now - 2 * week].map((ms) =>
      Math.floor(ms / 1000)
    );
    expect(getWeekStreaks(timestamps)).toEqual({ current: 3, longest: 3 });
  });

  it("ignores duplicate contests in the same week", () => {
    const now = Math.floor(Date.now() / 1000);
    expect(getWeekStreaks([now, now - 60])).toEqual({ current: 1, longest: 1 });
  });
});
