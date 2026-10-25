import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { clientKey, rateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { isSameOriginRequest } from "@/lib/requestOrigin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Accounts are not configured." }, { status: 503 });
  }

  const limit = await rateLimit("leaderboard-settings", clientKey(request), 20, 600);
  if (!limit.ok) {
    return rateLimitResponse(limit);
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in first." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const optIn = (body as { optIn?: unknown }).optIn;
  if (typeof optIn !== "boolean") {
    return NextResponse.json({ ok: false, error: "Invalid setting." }, { status: 400 });
  }

  await getPool().query("UPDATE users SET leaderboard_opt_in = $1 WHERE id = $2", [
    optIn,
    user.id,
  ]);

  return NextResponse.json({ ok: true, optIn });
}
