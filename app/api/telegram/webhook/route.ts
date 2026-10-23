import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  PLATFORM_META,
  formatDuration,
  type PlatformKey,
} from "@/lib/contestService";
import { getContestStats, getUpcomingContests } from "@/lib/contestSchedule";
import { formatIST, sendTelegramMessage } from "@/lib/alerts";
import { getPool, isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

interface TelegramUpdate {
  message?: {
    chat?: { id?: number };
    text?: string;
  };
}

const HELP_TEXT = [
  "ContestRadar alerts",
  "",
  "/upcoming - next five contests",
  "/platforms - counts and the next contest per platform",
  "/subscribe - enable contest reminders",
  "/subscribe codeforces leetcode - limit platforms",
  "/status - show your alert settings",
  "/unsubscribe - disable reminders",
  "",
  "Free forever. Calendar feeds: /api/calendar.ics",
].join("\n");

export async function POST(request: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && request.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "TELEGRAM_BOT_TOKEN is not configured" },
      { status: 503 }
    );
  }

  const update = (await request.json()) as TelegramUpdate;
  const chatId = update.message?.chat?.id;
  const text = update.message?.text?.trim();

  if (!chatId || !text) {
    return NextResponse.json({ ok: true });
  }

  const [rawCommand, ...args] = text.split(/\s+/);
  const command = rawCommand.toLowerCase().split("@")[0];
  const destination = String(chatId);

  if (command === "/start" || command === "/help") {
    await sendTelegramMessage(chatId, HELP_TEXT);
    return NextResponse.json({ ok: true });
  }

  if (command === "/subscribe") {
    if (!isDatabaseConfigured()) {
      await sendTelegramMessage(
        chatId,
        "Alert storage is not configured yet. Try the calendar feed: /api/calendar.ics"
      );
      return NextResponse.json({ ok: true });
    }

    const platforms = args
      .map((arg) => arg.toLowerCase())
      .filter((arg): arg is PlatformKey => arg in PLATFORM_META);

    await getPool().query(
      `INSERT INTO alert_subscriptions
         (channel, destination, platforms, lead_minutes, confirmed, unsubscribe_token)
       VALUES ('telegram', $1, $2, 60, TRUE, $3)
       ON CONFLICT (channel, destination) DO UPDATE SET
         platforms = EXCLUDED.platforms,
         confirmed = TRUE,
         unsubscribe_token = EXCLUDED.unsubscribe_token`,
      [destination, platforms, randomUUID()]
    );

    await sendTelegramMessage(
      chatId,
      `Reminders enabled for ${
        platforms.length > 0 ? platforms.join(", ") : "all platforms"
      }.\nLead time: 60 minutes.\nUse /status or /unsubscribe any time.`
    );
    return NextResponse.json({ ok: true });
  }

  if (command === "/unsubscribe") {
    if (isDatabaseConfigured()) {
      await getPool().query(
        "DELETE FROM alert_subscriptions WHERE channel = 'telegram' AND destination = $1",
        [destination]
      );
    }

    await sendTelegramMessage(
      chatId,
      "Reminders disabled. Use /subscribe to enable them again."
    );
    return NextResponse.json({ ok: true });
  }

  if (command === "/status") {
    if (!isDatabaseConfigured()) {
      await sendTelegramMessage(chatId, "Alert storage is not configured yet.");
      return NextResponse.json({ ok: true });
    }

    const result = await getPool().query<{
      platforms: string[];
      lead_minutes: number;
    }>(
      `SELECT platforms, lead_minutes
       FROM alert_subscriptions
       WHERE channel = 'telegram' AND destination = $1 AND confirmed = TRUE`,
      [destination]
    );

    const subscription = result.rows[0];
    await sendTelegramMessage(
      chatId,
      subscription
        ? `Reminders are on.\nPlatforms: ${
            subscription.platforms.length > 0
              ? subscription.platforms.join(", ")
              : "all platforms"
          }\nLead time: ${subscription.lead_minutes} minutes.`
        : "No active subscription. Use /subscribe to enable reminders."
    );
    return NextResponse.json({ ok: true });
  }

  if (command === "/upcoming" || command === "/contests") {
    const contests = await getUpcomingContests();
    const next = contests.slice(0, 5);

    if (next.length === 0) {
      await sendTelegramMessage(
        chatId,
        "No upcoming contests found. Try again in a few minutes."
      );
      return NextResponse.json({ ok: true });
    }

    const body = next
      .map(
        (contest, index) =>
          `${index + 1}. ${contest.name} (${contest.platform})\n${formatIST(
            contest.startTime
          )} · ${formatDuration(contest.duration)}\n${contest.url}`
      )
      .join("\n\n");

    await sendTelegramMessage(chatId, `Next contests\n\n${body}`);
    return NextResponse.json({ ok: true });
  }

  if (command === "/platforms") {
    const stats = await getContestStats();
    const body = stats.platforms
      .map(
        (platform) =>
          `${platform.platform}: ${platform.upcoming} upcoming · ${platform.active} live`
      )
      .join("\n");

    await sendTelegramMessage(
      chatId,
      body ? `Platforms\n\n${body}` : "No platform data available right now."
    );
    return NextResponse.json({ ok: true });
  }

  await sendTelegramMessage(chatId, HELP_TEXT);
  return NextResponse.json({ ok: true });
}
