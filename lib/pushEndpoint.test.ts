import { describe, expect, it } from "vitest";
import { isSafePushEndpoint } from "./pushEndpoint";

describe("isSafePushEndpoint", () => {
  it("accepts public HTTPS push endpoints", () => {
    expect(isSafePushEndpoint("https://fcm.googleapis.com/fcm/send/abc")).toBe(true);
    expect(isSafePushEndpoint("https://updates.push.services.mozilla.com/wpush/v2/abc")).toBe(true);
  });

  it("rejects non-HTTPS endpoints", () => {
    expect(isSafePushEndpoint("http://example.com/push")).toBe(false);
  });

  it("rejects loopback and private hosts", () => {
    expect(isSafePushEndpoint("https://localhost/push")).toBe(false);
    expect(isSafePushEndpoint("https://127.0.0.1/push")).toBe(false);
    expect(isSafePushEndpoint("https://10.0.0.1/push")).toBe(false);
    expect(isSafePushEndpoint("https://192.168.1.10/push")).toBe(false);
    expect(isSafePushEndpoint("https://172.16.0.1/push")).toBe(false);
    expect(isSafePushEndpoint("https://169.254.169.254/latest/meta-data")).toBe(false);
    expect(isSafePushEndpoint("https://[::1]/push")).toBe(false);
  });

  it("rejects credential-bearing URLs", () => {
    expect(isSafePushEndpoint("https://user:pass@example.com/push")).toBe(false);
  });
});
