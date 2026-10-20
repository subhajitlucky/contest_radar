import { describe, expect, it } from "vitest";
import {
  isValidEmail,
  normalizeLeadMinutes,
  normalizePlatforms,
} from "./alerts";

describe("alert input normalization", () => {
  it("validates emails", () => {
    expect(isValidEmail("dev@example.com")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  it("filters unknown platforms", () => {
    expect(normalizePlatforms(["codeforces", "nope", "leetcode"])).toEqual([
      "codeforces",
      "leetcode",
    ]);
    expect(normalizePlatforms("codeforces")).toEqual([]);
  });

  it("clamps lead time", () => {
    expect(normalizeLeadMinutes(1)).toBe(5);
    expect(normalizeLeadMinutes(60)).toBe(60);
    expect(normalizeLeadMinutes(5000)).toBe(1440);
    expect(normalizeLeadMinutes("nope")).toBe(60);
  });
});
