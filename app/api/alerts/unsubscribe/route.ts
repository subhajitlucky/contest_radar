import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.redirect(new URL("/alerts?error=db", request.url));
  }

  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/alerts?error=token", request.url));
  }

  await getPool().query(
    "DELETE FROM alert_subscriptions WHERE unsubscribe_token = $1",
    [token]
  );

  return NextResponse.redirect(new URL("/alerts?unsubscribed=1", request.url));
}
