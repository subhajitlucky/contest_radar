import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import {
  isValidEmail,
  normalizeLeadMinutes,
  normalizePlatforms,
  sendAlertEmail,
  siteUrl,
} from "@/lib/alerts";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Alert database is not configured yet." },
      { status: 503 }
    );
  }

  if (!process.env.RESEND_API_KEY || !process.env.ALERT_FROM_EMAIL) {
    return NextResponse.json(
      { ok: false, error: "Email delivery is not configured yet." },
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
    email?: unknown;
    platforms?: unknown;
    leadMinutes?: unknown;
  };
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const platforms = normalizePlatforms(payload.platforms);
  const leadMinutes = normalizeLeadMinutes(payload.leadMinutes);
  const confirmToken = randomUUID();
  const unsubscribeToken = randomUUID();
  const pool = getPool();

  const existing = await pool.query<{ confirmed: boolean }>(
    "SELECT confirmed FROM alert_subscriptions WHERE channel = 'email' AND destination = $1",
    [email]
  );
  const alreadyConfirmed = existing.rows[0]?.confirmed === true;

  await pool.query(
    `INSERT INTO alert_subscriptions
       (channel, destination, platforms, lead_minutes, confirmed, confirm_token, unsubscribe_token)
     VALUES ('email', $1, $2, $3, FALSE, $4, $5)
     ON CONFLICT (channel, destination) DO UPDATE SET
       platforms = EXCLUDED.platforms,
       lead_minutes = EXCLUDED.lead_minutes,
       confirm_token = EXCLUDED.confirm_token,
       unsubscribe_token = EXCLUDED.unsubscribe_token`,
    [email, platforms, leadMinutes, confirmToken, unsubscribeToken]
  );

  const base = siteUrl(request.url);
  const unsubscribeUrl = `${base}/api/alerts/unsubscribe?token=${unsubscribeToken}`;

  try {
    if (alreadyConfirmed) {
      await sendAlertEmail(
        email,
        "ContestRadar alert preferences updated",
        [
          "Your ContestRadar alert preferences were updated.",
          "",
          `Platforms: ${platforms.length > 0 ? platforms.join(", ") : "all platforms"}`,
          `Lead time: ${leadMinutes} minutes`,
          "",
          `Unsubscribe: ${unsubscribeUrl}`,
        ].join("\n")
      );

      return NextResponse.json({ ok: true, message: "Preferences updated." });
    }

    const confirmUrl = `${base}/api/alerts/confirm?token=${confirmToken}`;
    await sendAlertEmail(
      email,
      "Confirm your ContestRadar alerts",
      [
        "Confirm your ContestRadar contest alerts:",
        confirmUrl,
        "",
        `Platforms: ${platforms.length > 0 ? platforms.join(", ") : "all platforms"}`,
        `Lead time: ${leadMinutes} minutes`,
        "",
        "If you did not request this, ignore this email.",
      ].join("\n")
    );

    return NextResponse.json({ ok: true, message: "Confirmation email sent." });
  } catch (error) {
    console.error("[alerts/subscribe] send failed:", error);
    return NextResponse.json(
      { ok: false, error: "Could not send the confirmation email. Try again later." },
      { status: 502 }
    );
  }
}
