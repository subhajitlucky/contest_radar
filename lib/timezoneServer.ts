import { cookies } from "next/headers";
import { DEFAULT_TIME_ZONE, isValidTimeZone } from "./timezone";

export async function getTimeZone(): Promise<string> {
  const store = await cookies();
  const value = store.get("cr_tz")?.value;

  return value && isValidTimeZone(value) ? value : DEFAULT_TIME_ZONE;
}
