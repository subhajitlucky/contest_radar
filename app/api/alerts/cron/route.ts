import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import {
  contestAlertText,
  sendAlertEmail,
  sendTelegramMessage,
  siteUrl,
  type AlertSubscription,
} from "@/lib/alerts";
import { getUpcomingContests } from "@/lib/contestService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not configured" },
      { status: 503 }
    );
  }

  const header = request.headers.get("authorization") || "";
  if (header !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Alert database is not configured" },
      { status: 503 }
    );
  }

  const pool = getPool();
  const subscriptions = await pool.query<AlertSubscription>(
    `SELECT id, channel, destination, platforms, lead_minutes, confirmed, unsubscribe_token
     FROM alert_subscriptions
     WHERE confirmed = TRUE`
  );

  const contests = await getUpcomingContests();
  const now = Date.now();
  const base = siteUrl(request.url);
  let sent = 0;
  let failed = 0;

  for (const subscription of subscriptions.rows) {
    const leadMs = subscription.lead_minutes * 60 * 1000;
    const due = contests.filter((contest) => {
      const start = new Date(contest.startTime).getTime();
      const matchesPlatform =
        subscription.platforms.length === 0 ||
        subscription.platforms.includes(contest.platformKey);
      return matchesPlatform && start > now && start <= now + leadMs;
    });

    for (const contest of due) {
      const contestKey = `${contest.platformKey}:${contest.id}`;
      const claim = await pool.query(
        `INSERT INTO alert_deliveries (subscription_id, contest_key)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING
         RETURNING subscription_id`,
        [subscription.id, contestKey]
      );

      if (claim.rowCount === 0) continue;

      try {
        if (subscription.channel === "telegram") {
          await sendTelegramMessage(
            subscription.destination,
            `${contestAlertText(contest)}\n\nManage alerts: /unsubscribe`
          );
        } else {
          const unsubscribeUrl = `${base}/api/alerts/unsubscribe?token=${subscription.unsubscribe_token}`;
          await sendAlertEmail(
            subscription.destination,
            `Contest soon: ${contest.name}`,
            contestAlertText(contest, unsubscribeUrl)
          );
        }
        sent += 1;
      } catch (error) {
        failed += 1;
        await pool.query(
          `DELETE FROM alert_deliveries
           WHERE subscription_id = $1 AND contest_key = $2`,
          [subscription.id, contestKey]
        );
        console.error(`[alerts/cron] delivery failed for ${contestKey}:`, error);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    subscriptions: subscriptions.rowCount,
    sent,
    failed,
  });
}
