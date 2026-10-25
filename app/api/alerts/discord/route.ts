import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { normalizeLeadMinutes, normalizePlatforms } from "@/lib/alerts";
import { isSameOriginRequest } from "@/lib/requestOrigin";

export const dynamic = "force-dynamic";

function validDiscordWebhook(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (!["discord.com", "discordapp.com"].includes(url.hostname)) return false;
    return url.pathname.startsWith("/api/webhooks/");
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Alert database is not configured yet." },
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
    webhookUrl?: unknown;
    platforms?: unknown;
    leadMinutes?: unknown;
  };
  const webhookUrl = typeof payload.webhookUrl === "string" ? payload.webhookUrl.trim() : "";

  if (!validDiscordWebhook(webhookUrl)) {
    return NextResponse.json(
      { ok: false, error: "Paste a valid Discord webhook URL." },
      { status: 400 }
    );
  }

  const platforms = normalizePlatforms(payload.platforms);
  const leadMinutes = normalizeLeadMinutes(payload.leadMinutes);
  const user = await getSessionUser();

  await getPool().query(
    `INSERT INTO alert_subscriptions
       (channel, destination, platforms, lead_minutes, confirmed, unsubscribe_token, user_id)
     VALUES ('discord', $1, $2, $3, TRUE, $4, $5)
     ON CONFLICT (channel, destination) DO UPDATE SET
       platforms = EXCLUDED.platforms,
       lead_minutes = EXCLUDED.lead_minutes,
       confirmed = TRUE,
       unsubscribe_token = EXCLUDED.unsubscribe_token,
       user_id = COALESCE(EXCLUDED.user_id, alert_subscriptions.user_id)`,
    [webhookUrl, platforms, leadMinutes, randomUUID(), user?.id ?? null]
  );

  return NextResponse.json({ ok: true, message: "Discord reminders enabled." });
}
