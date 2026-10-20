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

  const result = await getPool().query(
    `UPDATE alert_subscriptions
     SET confirmed = TRUE, confirm_token = NULL
     WHERE confirm_token = $1
     RETURNING id`,
    [token]
  );

  return NextResponse.redirect(
    new URL(result.rowCount ? "/alerts?confirmed=1" : "/alerts?error=token", request.url)
  );
}
