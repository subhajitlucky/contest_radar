import { describe, expect, it } from "vitest";
import { contestKey, parseFavorites } from "./favorites";

describe("favorites", () => {
  it("builds namespaced keys", () => {
    expect(contestKey({ platformKey: "codeforces", id: 2277 })).toBe("codeforces:2277");
  });

  it("parses valid arrays", () => {
    expect(parseFavorites('["a:b","c:d"]')).toEqual(["a:b", "c:d"]);
  });

  it("rejects malformed data", () => {
    expect(parseFavorites("")).toEqual([]);
    expect(parseFavorites("nope")).toEqual([]);
    expect(parseFavorites('["ok",1,null]')).toEqual(["ok"]);
  });
});
