import {
  PLATFORM_META,
  formatDuration,
  type Contest,
  type PlatformKey,
} from "@/lib/contestService";

export interface AlertSubscription {
  id: string;
  channel: "email" | "telegram" | "discord";
  destination: string;
  platforms: PlatformKey[];
  lead_minutes: number;
  confirmed: boolean;
  unsubscribe_token: string;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function normalizePlatforms(value: unknown): PlatformKey[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is PlatformKey =>
      typeof item === "string" && item in PLATFORM_META
  );
}

export function normalizeLeadMinutes(value: unknown): number {
  const minutes = Number(value);
  if (!Number.isFinite(minutes)) return 60;
  return Math.min(1440, Math.max(5, Math.round(minutes)));
}

export function siteUrl(requestUrl: string): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || new URL(requestUrl).origin).replace(/\/$/, "");
}

export function formatIST(iso: string): string {
  return `${new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })} IST`;
}

export function contestAlertText(contest: Contest, unsubscribeUrl?: string): string {
  const lines = [
    `${contest.name} (${contest.platform})`,
    `Starts: ${formatIST(contest.startTime)}`,
    `Duration: ${formatDuration(contest.duration)}`,
    `Contest: ${contest.url}`,
  ];

  if (unsubscribeUrl) {
    lines.push("", `Unsubscribe: ${unsubscribeUrl}`);
  }

  return lines.join("\n");
}

export async function sendAlertEmail(
  to: string,
  subject: string,
  text: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ALERT_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and ALERT_FROM_EMAIL are required");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend error ${response.status}: ${message}`);
  }
}

export async function sendDiscordMessage(
  webhookUrl: string,
  text: string
): Promise<void> {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: text,
      allowed_mentions: { parse: [] },
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Discord error ${response.status}: ${message}`);
  }
}

export async function sendTelegramMessage(
  chatId: string | number,
  text: string
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Telegram error ${response.status}: ${message}`);
  }
}
