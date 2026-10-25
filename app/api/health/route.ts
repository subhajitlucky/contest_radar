import { NextResponse } from "next/server";
import { readSourceHealth } from "@/lib/contestStore";
import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

const STALE_AFTER_MS = 60 * 60 * 1000;
const FAILURE_THRESHOLD = 3;

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, status: "unconfigured", error: "DATABASE_URL is not configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const sources = await readSourceHealth();
    const now = Date.now();
    const stale = sources.filter(
      (source) =>
        !source.lastSuccessAt ||
        now - new Date(source.lastSuccessAt).getTime() > STALE_AFTER_MS,
    );
    const failing = sources.filter(
      (source) => source.consecutiveFailures >= FAILURE_THRESHOLD,
    );
    const ok = sources.length > 0 && stale.length === 0 && failing.length === 0;

    return NextResponse.json(
      {
        ok,
        status: ok ? "ok" : "degraded",
        lastRefresh: sources
          .map((source) => source.lastSuccessAt)
          .filter((value): value is string => Boolean(value))
          .sort()
          .at(-1) ?? null,
        stale: stale.map((source) => source.sourceKey),
        failing: failing.map((source) => source.sourceKey),
        sources: sources.map((source) => ({
          source: source.sourceKey,
          lastSuccessAt: source.lastSuccessAt,
          latencyMs: source.latencyMs,
          consecutiveFailures: source.consecutiveFailures,
        })),
        timestamp: new Date().toISOString(),
      },
      {
        status: ok ? 200 : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("[API/health] Error:", error);
    return NextResponse.json(
      {
        ok: false,
        status: "error",
        error: "Health check failed",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
