import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "./db";

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
};

export function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  return ip || "unknown";
}

export async function rateLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const resetAt = new Date(Date.now() + windowSeconds * 1000);

  if (!isDatabaseConfigured()) {
    return { ok: true, limit, remaining: limit, resetAt };
  }

  const key = `${scope}:${identifier}`;
  const result = await getPool().query<{ count: number; reset_at: Date }>(
    `INSERT INTO rate_limits (key, count, reset_at, updated_at)
     VALUES ($1, 1, NOW() + make_interval(secs => $2::int), NOW())
     ON CONFLICT (key) DO UPDATE SET
       count = CASE WHEN rate_limits.reset_at <= NOW() THEN 1 ELSE rate_limits.count + 1 END,
       reset_at = CASE
         WHEN rate_limits.reset_at <= NOW() THEN NOW() + make_interval(secs => $2::int)
         ELSE rate_limits.reset_at
       END,
       updated_at = NOW()
     RETURNING count, reset_at`,
    [key, windowSeconds],
  );

  const row = result.rows[0];
  return {
    ok: row.count <= limit,
    limit,
    remaining: Math.max(0, limit - row.count),
    resetAt: new Date(row.reset_at),
  };
}

export function rateLimitResponse(result: RateLimitResult) {
  const retryAfter = Math.max(
    1,
    Math.ceil((result.resetAt.getTime() - Date.now()) / 1000),
  );

  return NextResponse.json(
    { ok: false, error: "Too many requests. Try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
      },
    },
  );
}

export async function cleanupRateLimits(): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await getPool().query(
    "DELETE FROM rate_limits WHERE reset_at < NOW() - INTERVAL '1 day'",
  );
}
