import { describe, expect, it } from "vitest";
import { CIRCUIT_COOLDOWN_MS, isCircuitOpen } from "./sourceCircuit";
import type { SourceHealth } from "./contestStore";

const now = Date.parse("2026-10-25T00:00:00.000Z");

function health(overrides: Partial<SourceHealth> = {}): SourceHealth {
  return {
    sourceKey: "atcoder",
    lastAttemptAt: new Date(now - 60_000).toISOString(),
    lastSuccessAt: null,
    lastErrorAt: null,
    lastError: "rate limited",
    latencyMs: 500,
    lastContestCount: null,
    consecutiveFailures: 5,
    updatedAt: new Date(now - 60_000).toISOString(),
    ...overrides,
  };
}

describe("isCircuitOpen", () => {
  it("stays closed for an unknown source", () => {
    expect(isCircuitOpen(undefined, now)).toBe(false);
  });

  it("stays closed below the failure threshold", () => {
    expect(isCircuitOpen(health({ consecutiveFailures: 4 }), now)).toBe(false);
  });

  it("opens after five failures inside the cooldown", () => {
    expect(isCircuitOpen(health(), now)).toBe(true);
  });

  it("closes again after the cooldown", () => {
    expect(
      isCircuitOpen(
        health({ lastAttemptAt: new Date(now - CIRCUIT_COOLDOWN_MS - 1).toISOString() }),
        now,
      ),
    ).toBe(false);
  });

  it("stays closed when there is no last attempt", () => {
    expect(isCircuitOpen(health({ lastAttemptAt: null }), now)).toBe(false);
  });
});
