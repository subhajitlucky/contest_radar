import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { normalizeLeadMinutes, normalizePlatforms } from "@/lib/alerts";
import { isSafePushEndpoint } from "@/lib/pushEndpoint";
import { isSameOriginRequest } from "@/lib/requestOrigin";

export const dynamic = "force-dynamic";

interface PushSubscriptionPayload {
  endpoint?: unknown;
  keys?: { p256dh?: unknown; auth?: unknown };
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Push storage is not configured yet." },
      { status: 503 }
    );
  }

  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json(
      { ok: false, error: "Push delivery is not configured yet." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const payload = body as {
    subscription?: PushSubscriptionPayload;
    platforms?: unknown;
    leadMinutes?: unknown;
  };
  const subscription = payload.subscription;
  const endpoint = typeof subscription?.endpoint === "string" ? subscription.endpoint : "";
  const p256dh = typeof subscription?.keys?.p256dh === "string" ? subscription.keys.p256dh : "";
  const auth = typeof subscription?.keys?.auth === "string" ? subscription.keys.auth : "";

  if (!isSafePushEndpoint(endpoint) || !p256dh || !auth) {
    return NextResponse.json(
      { ok: false, error: "Invalid push subscription." },
      { status: 400 }
    );
  }

  const platforms = normalizePlatforms(payload.platforms);
  const leadMinutes = normalizeLeadMinutes(payload.leadMinutes);
  const user = await getSessionUser();

  await getPool().query(
    `INSERT INTO push_subscriptions
       (endpoint, p256dh, auth, platforms, lead_minutes, user_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (endpoint) DO UPDATE SET
       p256dh = EXCLUDED.p256dh,
       auth = EXCLUDED.auth,
       platforms = EXCLUDED.platforms,
       lead_minutes = EXCLUDED.lead_minutes,
       user_id = COALESCE(EXCLUDED.user_id, push_subscriptions.user_id)`,
    [endpoint, p256dh, auth, platforms, leadMinutes, user?.id ?? null]
  );

  return NextResponse.json({ ok: true, message: "Browser push enabled." });
}
