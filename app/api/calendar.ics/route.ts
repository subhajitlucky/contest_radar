import { NextRequest, NextResponse } from "next/server";
import { PLATFORM_META, type PlatformKey } from "@/lib/contestService";
import { getUpcomingContests } from "@/lib/contestSchedule";
import { buildCalendar, toICSDate } from "@/lib/ics";

export const dynamic = "force-dynamic";

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
  const body = buildCalendar(
    contests,
    stamp,
    `ContestRadar${platform ? ` ${PLATFORM_META[platform].name}` : ""}`
  );

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="contestradar${platform ? `-${platform}` : ""}.ics"`,
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
