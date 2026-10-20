import type { Contest } from "@/lib/contestService";

export function toICSDate(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export function escapeICS(value: string): string {
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

export function buildCalendar(
  contests: Contest[],
  stamp: string,
  calendarName = "ContestRadar"
): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ContestRadar//Contest Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeICS(calendarName)}`,
    "X-WR-TIMEZONE:UTC",
    ...contests.flatMap((contest) => toEvent(contest, stamp)),
    "END:VCALENDAR",
  ].join("\r\n");
}
