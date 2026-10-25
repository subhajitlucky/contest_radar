import { expect, test } from "@playwright/test";

test.describe("API and auth gates", () => {
  test("health is operational", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.status).toBe("ok");
    expect(body.sources).toHaveLength(5);
  });

  test("serves the seeded schedule", async ({ request }) => {
    const response = await request.get("/api/contests");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data.map((contest: { name: string }) => contest.name)).toContain(
      "E2E Practice Round",
    );
  });

  test("rejects cross-origin mutations", async ({ request }) => {
    const response = await request.post("/api/auth/request", {
      headers: {
        origin: "https://evil.example",
        "content-type": "application/json",
      },
      data: { email: "e2e@example.com" },
    });

    expect(response.status()).toBe(403);
  });

  test("rate limits repeated auth requests", async ({ request }) => {
    const ip = `198.51.100.${Math.floor(Math.random() * 200) + 1}`;
    const headers = {
      "x-forwarded-for": ip,
      "content-type": "application/json",
    };

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const response = await request.post("/api/auth/request", {
        headers,
        data: { email: "e2e@example.com" },
      });
      expect(response.status()).toBe(503);
    }

    const limited = await request.post("/api/auth/request", {
      headers,
      data: { email: "e2e@example.com" },
    });

    expect(limited.status()).toBe(429);
    expect(limited.headers()["retry-after"]).toBeTruthy();
  });

  test("dashboard is auth-gated", async ({ request }) => {
    const response = await request.get("/dashboard", { maxRedirects: 0 });
    expect([302, 307]).toContain(response.status());
    expect(response.headers()["location"]).toContain("/login");
  });
});
