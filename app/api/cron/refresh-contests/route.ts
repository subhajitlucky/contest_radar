import { NextRequest, NextResponse } from "next/server";
import { refreshContests } from "@/lib/contestSchedule";
import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not configured" },
      { status: 503 },
    );
  }

  const header = request.headers.get("authorization") || "";
  if (header !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Contest database is not configured" },
      { status: 503 },
    );
  }

  const results = await refreshContests();

  return NextResponse.json({
    ok: results.every((result) => result.ok),
    data: results,
    timestamp: new Date().toISOString(),
  });
}
