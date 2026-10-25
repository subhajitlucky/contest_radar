import { describe, expect, it } from "vitest";
import { isValidTimeZone, timeZoneLabel } from "./timezone";

describe("timezone helpers", () => {
  it("recognizes IANA zones", () => {
    expect(isValidTimeZone("Asia/Kolkata")).toBe(true);
    expect(isValidTimeZone("UTC")).toBe(true);
    expect(isValidTimeZone("Not/AZone")).toBe(false);
  });

  it("uses short labels for common zones", () => {
    expect(timeZoneLabel("Asia/Kolkata")).toBe("IST");
    expect(timeZoneLabel("America/New_York")).toBe("ET");
    expect(timeZoneLabel("UTC")).toBe("UTC");
  });
});
