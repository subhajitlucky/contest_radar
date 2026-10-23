import { NextResponse } from "next/server";
import { readSourceHealth } from "@/lib/contestStore";
import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Contest database is not configured" },
      { status: 503 },
    );
  }

  try {
    const sources = await readSourceHealth();

    return NextResponse.json(
      {
        ok: true,
        data: sources,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("[API/source-health] Error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to read source health",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
