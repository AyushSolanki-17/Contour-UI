import { expect, test, type APIRequestContext } from "@playwright/test";

const fixtureOrigin = "http://127.0.0.1:18081";

async function setHealthState(request: APIRequestContext, state: "ready" | "unavailable" | "slow") {
  const response = await request.get(`${fixtureOrigin}/__test__/state?state=${state}`);
  expect(response.ok()).toBe(true);
}

async function expectOnlyHealthRequests(request: APIRequestContext) {
  const response = await request.get(`${fixtureOrigin}/__test__/requests`);
  const body = await response.json() as { requests: string[] };
  expect(body.requests).not.toHaveLength(0);
  expect(body.requests).toEqual(body.requests.map(() => "/health/ready"));
}

test("desktop shell distinguishes available and unavailable product surfaces", async ({ page, request }) => {
  await setHealthState(request, "ready");
  await page.setViewportSize({ width: 1440, height: 900 });

  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto("/");

  await expect(page.getByRole("status")).toHaveText("Ready");
  await expect(page.getByText("Application shell")).toBeVisible();
  await expect(page.getByText("Available now")).toBeVisible();

  const unavailable = page.locator('[aria-disabled="true"]');
  await expect(unavailable).toHaveCount(3);
  await expect(unavailable).toHaveText(["WorkspacesSoon", "SourcesSoon", "ExploreSoon"]);
  expect(await unavailable.evaluateAll((items) => items.every((item) => !item.hasAttribute("href")))).toBe(true);
  expect(consoleErrors).toEqual([]);
  await expectOnlyHealthRequests(request);
});

test("mobile shell keeps unavailable items out of keyboard navigation and exposes focus", async ({ page, request }) => {
  await setHealthState(request, "unavailable");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const retry = page.getByRole("button", { name: "Retry readiness check" });
  await expect(page.getByRole("status")).toHaveText("Unavailable");
  await expect(retry).toBeVisible();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(retry).toBeFocused();
  await expect(retry).toHaveCSS("outline-style", "solid");
  await expect(page.locator('[aria-disabled="true"]')).toHaveCount(3);
  await expectOnlyHealthRequests(request);
});

test("a slow unavailable readiness response remains unavailable until retry succeeds", async ({ page, request }) => {
  await setHealthState(request, "slow");
  const startedAt = Date.now();
  await page.goto("/");
  expect(Date.now() - startedAt).toBeGreaterThanOrEqual(250);

  const retry = page.getByRole("button", { name: "Retry readiness check" });
  await expect(page.getByRole("status")).toHaveText("Unavailable");
  await setHealthState(request, "ready");
  await retry.click();
  await expect(page.getByRole("status")).toHaveText("Ready");
  await expect(page.getByRole("button", { name: "Retry readiness check" })).toHaveCount(0);
  await expectOnlyHealthRequests(request);
});
