import { NextRequest, NextResponse } from "next/server";
import {
  PLATFORM_META,
  getUpcomingContests,
  type Contest,
  type PlatformKey,
} from "@/lib/contestService";

export const dynamic = "force-dynamic";

function toICSDate(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function escapeICS(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function toEvent(contest: Contest, stamp: string): string[] {
  return [
    "BEGIN:VEVENT",
    `UID:${contest.platformKey}-${contest.id}@contestradar`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toICSDate(contest.startTime)}`,
    `DTEND:${toICSDate(contest.endTime)}`,
    `SUMMARY:${escapeICS(`${contest.name} (${contest.platform})`)}`,
    `DESCRIPTION:${escapeICS(
      [
        contest.description ?? "",
        `Duration: ${contest.duration} minutes`,
        `Type: ${contest.type}`,
      ]
        .filter(Boolean)
        .join("\n")
    )}`,
    `URL:${contest.url}`,
    "END:VEVENT",
  ];
}

export async function GET(request: NextRequest) {
  const requestedPlatform = request.nextUrl.searchParams.get("platform");
  const platform =
    requestedPlatform && requestedPlatform in PLATFORM_META
      ? (requestedPlatform as PlatformKey)
      : null;

  const allContests = await getUpcomingContests();
  const contests = platform
    ? allContests.filter((contest) => contest.platformKey === platform)
    : allContests;
  const stamp = toICSDate(new Date().toISOString());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ContestRadar//Contest Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:ContestRadar${platform ? ` ${PLATFORM_META[platform].name}` : ""}`,
    "X-WR-TIMEZONE:UTC",
    ...contests.flatMap((contest) => toEvent(contest, stamp)),
    "END:VCALENDAR",
  ];

  return new NextResponse(lines.join("\r\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="contestradar${platform ? `-${platform}` : ""}.ics"`,
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
