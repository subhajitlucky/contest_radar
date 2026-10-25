export const DEFAULT_TIME_ZONE = "Asia/Kolkata";

export const TIME_ZONE_OPTIONS = [
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "US Eastern" },
  { value: "America/Chicago", label: "US Central" },
  { value: "America/Denver", label: "US Mountain" },
  { value: "America/Los_Angeles", label: "US Pacific" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Berlin", label: "Central Europe" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Australia/Sydney", label: "Sydney" },
] as const;

const SHORT_LABELS: Record<string, string> = {
  "Asia/Kolkata": "IST",
  UTC: "UTC",
  "America/New_York": "ET",
  "America/Chicago": "CT",
  "America/Denver": "MT",
  "America/Los_Angeles": "PT",
  "Europe/London": "GMT/BST",
  "Europe/Berlin": "CET",
  "Asia/Tokyo": "JST",
  "Asia/Singapore": "SGT",
  "Australia/Sydney": "AET",
};

export function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function timeZoneLabel(timeZone: string): string {
  if (SHORT_LABELS[timeZone]) return SHORT_LABELS[timeZone];

  try {
    return (
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "short",
      })
        .formatToParts(new Date())
        .find((part) => part.type === "timeZoneName")?.value ?? timeZone
    );
  } catch {
    return timeZone;
  }
}
