import { describe, expect, it } from "vitest";
import { buildCalendar, escapeICS, toICSDate } from "./ics";
import type { Contest } from "./contestService";

const contest: Contest = {
  id: 1,
  name: "Round, with; punctuation",
  platform: "Codeforces",
  platformKey: "codeforces",
  startTime: "2026-10-24T11:05:00.000Z",
  endTime: "2026-10-24T13:05:00.000Z",
  duration: 120,
  type: "Div. 2",
  description: "Line one\nLine two",
  url: "https://codeforces.com/contest/1",
  phase: "BEFORE",
  isRegistrationOpen: true,
};

describe("ICS generation", () => {
  it("formats UTC timestamps", () => {
    expect(toICSDate("2026-10-24T11:05:00.000Z")).toBe("20261024T110500Z");
  });

  it("escapes commas, semicolons, and newlines", () => {
    expect(escapeICS("a,b;c\nd")).toBe("a\\,b\\;c\\nd");
  });

  it("builds a VCALENDAR with one VEVENT", () => {
    const body = buildCalendar([contest], "20261020T000000Z");
    expect(body).toContain("BEGIN:VCALENDAR");
    expect(body).toContain("BEGIN:VEVENT");
    expect(body).toContain("SUMMARY:Round\\, with\\; punctuation (Codeforces)");
    expect(body).toContain("DTSTART:20261024T110500Z");
    expect(body.match(/BEGIN:VEVENT/g)?.length).toBe(1);
    expect(body).toContain("END:VCALENDAR");
  });
});
