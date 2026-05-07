const { test, expect } = require("@playwright/test");

test("login page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("link", { name: /login/i })).toBeVisible();
});