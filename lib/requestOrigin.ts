import type { NextRequest } from "next/server";

export function isSameOrigin(
  requestUrl: string,
  origin: string | null,
  secFetchSite: string | null,
): boolean {
  const expected = new URL(requestUrl).origin;

  if (origin && origin !== expected) {
    return false;
  }

  if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "none") {
    return false;
  }

  return true;
}

export function isSameOriginRequest(request: NextRequest): boolean {
  return isSameOrigin(
    request.url,
    request.headers.get("origin"),
    request.headers.get("sec-fetch-site"),
  );
}
