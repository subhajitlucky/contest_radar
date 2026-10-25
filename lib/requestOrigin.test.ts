import { describe, expect, it } from "vitest";
import { isSameOrigin } from "./requestOrigin";

describe("isSameOrigin", () => {
  const url = "https://contestradar.vercel.app/api/auth/request";

  it("accepts a same-origin browser request", () => {
    expect(isSameOrigin(url, "https://contestradar.vercel.app", "same-origin")).toBe(true);
  });

  it("accepts non-browser clients without origin headers", () => {
    expect(isSameOrigin(url, null, null)).toBe(true);
  });

  it("rejects a cross-origin request", () => {
    expect(isSameOrigin(url, "https://evil.example", "cross-site")).toBe(false);
  });

  it("rejects a cross-site fetch even without an origin header", () => {
    expect(isSameOrigin(url, null, "cross-site")).toBe(false);
  });

  it("accepts direct navigation form posts", () => {
    expect(isSameOrigin(url, null, "none")).toBe(true);
  });
});
