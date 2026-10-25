import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";
import { isSameOriginRequest } from "@/lib/requestOrigin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  await destroySession();
  return NextResponse.redirect(new URL("/", request.url), 303);
}
