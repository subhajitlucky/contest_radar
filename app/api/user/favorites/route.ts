import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { isSameOriginRequest } from "@/lib/requestOrigin";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Accounts are not configured." }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in first." }, { status: 401 });
  }

  const result = await getPool().query<{ contest_key: string }>(
    "SELECT contest_key FROM user_favorites WHERE user_id = $1 ORDER BY created_at",
    [user.id]
  );

  return NextResponse.json(
    { ok: true, favorites: result.rows.map((row) => row.contest_key) },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Accounts are not configured." }, { status: 503 });
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

  const favorites = (body as { favorites?: unknown }).favorites;
  if (!Array.isArray(favorites) || favorites.length > 500) {
    return NextResponse.json({ ok: false, error: "Invalid favorites list." }, { status: 400 });
  }

  const keys = favorites.filter(
    (item): item is string => typeof item === "string" && item.length > 0 && item.length <= 120
  );

  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM user_favorites WHERE user_id = $1", [user.id]);
    for (const key of keys) {
      await client.query(
        "INSERT INTO user_favorites (user_id, contest_key) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [user.id, key]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return NextResponse.json({ ok: true, count: keys.length });
}
