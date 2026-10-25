import type { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { clientKey } from "./rateLimit";

function request(headers: Record<string, string>): NextRequest {
  return { headers: new Headers(headers) } as NextRequest;
}

describe("clientKey", () => {
  it("uses the first forwarded address", () => {
    expect(clientKey(request({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip", () => {
    expect(clientKey(request({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
  });

  it("uses a shared bucket when no address is available", () => {
    expect(clientKey(request({}))).toBe("unknown");
  });
});
