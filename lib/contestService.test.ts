import { describe, expect, it } from "vitest";
import {
  dayKey,
  formatContestDate,
  formatDate,
  formatDuration,
  formatISTDate,
  formatISTTime,
  formatTime,
  getContestStatus,
  getGoogleCalendarUrl,
  istDayKey,
  type Contest,
} from "./contestService";

const contest: Contest = {
  id: 2277,
  name: "Codeforces Round (Div. 2)",
  platform: "Codeforces",
  platformKey: "codeforces",
  startTime: "2026-10-24T11:05:00.000Z",
  endTime: "2026-10-24T13:05:00.000Z",
  duration: 120,
  type: "Div. 2",
  url: "https://codeforces.com/contest/2277",
  phase: "BEFORE",
  isRegistrationOpen: true,
};

describe("formatDuration", () => {
  it("uses singular and plural hours correctly", () => {
    expect(formatDuration(30)).toBe("30 minutes");
    expect(formatDuration(60)).toBe("1 hour");
    expect(formatDuration(120)).toBe("2 hours");
    expect(formatDuration(90)).toBe("1h 30m");
  });
});

describe("IST formatting", () => {
  it("formats UTC times in IST", () => {
    expect(formatISTTime("2026-10-21T14:30:00.000Z")).toBe("8:00 PM");
    expect(formatISTDate("2026-10-21T14:30:00.000Z")).toContain("21");
    expect(istDayKey("2026-10-21T14:30:00.000Z")).toBe("2026-10-21");
    expect(formatContestDate("2026-10-21T14:30:00.000Z")).toContain("IST");
  });
});

describe("timezone formatting", () => {
  it("formats the same instant in another timezone", () => {
    const iso = "2026-10-21T14:30:00.000Z";
    expect(formatTime(iso, "UTC")).toBe("2:30 PM");
    expect(formatDate(iso, "UTC")).toContain("21");
    expect(dayKey(iso, "UTC")).toBe("2026-10-21");
    expect(formatContestDate(iso, "UTC")).toContain("UTC");
  });
});

describe("getContestStatus", () => {
  it("detects upcoming, live, and ended", () => {
    expect(getContestStatus("2020-10-24T11:05:00.000Z", "2020-10-24T13:05:00.000Z")).toBe(
      "ended"
    );
    expect(getContestStatus("2030-10-24T11:05:00.000Z", "2030-10-24T13:05:00.000Z")).toBe(
      "upcoming"
    );
    expect(
      getContestStatus(
        new Date(Date.now() - 60_000).toISOString(),
        new Date(Date.now() + 60_000).toISOString()
      )
    ).toBe("live");
  });
});

describe("getGoogleCalendarUrl", () => {
  it("builds a template URL with UTC dates", () => {
    const url = getGoogleCalendarUrl(contest);
    expect(url).toContain("action=TEMPLATE");
    expect(url).toContain("20261024T110500Z");
    expect(url).toContain("20261024T130500Z");
  });
});
