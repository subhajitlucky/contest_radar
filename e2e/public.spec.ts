import { expect, test } from "@playwright/test";

const publicRoutes = ["/", "/contests", "/status", "/developers", "/alerts", "/login"];

test.describe("public site", () => {
  for (const route of publicRoutes) {
    test(`${route} renders`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("body")).not.toContainText("Application error");
    });
  }

  test("uses IST by default", async ({ page }) => {
    await page.goto("/contests");
    await expect(page.getByText(/times in IST/i).first()).toBeVisible();
  });

  test("respects the timezone cookie", async ({ context, page, baseURL }) => {
    await context.addCookies([
      {
        name: "cr_tz",
        value: "America/New_York",
        url: baseURL ?? "http://127.0.0.1:3000",
      },
    ]);

    await page.goto("/contests");
    await expect(page.getByText(/times in ET/i).first()).toBeVisible();
    await expect(page.getByLabel("Time zone")).toHaveValue("America/New_York");
  });

  test("embed honors the tz override", async ({ page }) => {
    await page.goto("/embed/calendar?tz=UTC");
    await expect(page.getByText(/Times in UTC/i).first()).toBeVisible();
  });
});
