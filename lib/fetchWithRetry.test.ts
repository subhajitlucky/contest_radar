import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWithRetry, parseRetryAfter } from "./fetchWithRetry";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("parseRetryAfter", () => {
  it("parses seconds", () => {
    expect(parseRetryAfter("120")).toBe(120_000);
  });

  it("parses an HTTP date", () => {
    const now = Date.parse("2026-10-25T00:00:00.000Z");
    expect(parseRetryAfter("Sun, 25 Oct 2026 00:00:05 GMT", now)).toBe(5_000);
  });

  it("ignores invalid values", () => {
    expect(parseRetryAfter(null)).toBeNull();
    expect(parseRetryAfter("not-a-date")).toBeNull();
  });
});

describe("fetchWithRetry", () => {
  it("retries a 429 using Retry-After", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response("", { status: 429, headers: { "retry-after": "0" } }),
      )
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));

    vi.stubGlobal("fetch", fetchMock);

    const response = await fetchWithRetry(
      "https://example.com",
      {},
      { retries: 1, baseDelayMs: 0, timeoutMs: 1_000 },
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries a 5xx response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));

    vi.stubGlobal("fetch", fetchMock);

    const response = await fetchWithRetry(
      "https://example.com",
      {},
      { retries: 1, baseDelayMs: 0, timeoutMs: 1_000 },
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry a 4xx response other than 429", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("", { status: 404 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await fetchWithRetry(
      "https://example.com",
      {},
      { retries: 3, baseDelayMs: 0, timeoutMs: 1_000 },
    );

    expect(response.status).toBe(404);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries a network error once", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));

    vi.stubGlobal("fetch", fetchMock);

    const response = await fetchWithRetry(
      "https://example.com",
      {},
      { retries: 1, baseDelayMs: 0, timeoutMs: 1_000 },
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
