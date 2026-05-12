import { test, expect } from "@playwright/test";
import {
  createUser,
  DEFAULT_PASSWORD,
  disposeContexts,
  login,
  logout,
  uniqueValue,
} from "./helpers/testHelpers";

test("login page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
});

test("user can sign in with valid credentials", async ({ page }) => {
  const account = await createUser("student");

  try {
    await login(page, account.user);
    await expect(
      page.getByText(`${account.user.name} (student)`)
    ).toBeVisible();
  } finally {
    await disposeContexts(account.api);
  }
});

test("invalid login shows an error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("UserName").fill(uniqueValue("missing-user"));
  await page.getByLabel("Password").fill(DEFAULT_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page.getByText("Invalid credentials")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("logged in user can log out", async ({ page }) => {
  const account = await createUser("student");

  try {
    await login(page, account.user);
    await logout(page);
    await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
  } finally {
    await disposeContexts(account.api);
  }
});

test("protected routes redirect unauthenticated users to login", async ({
  page,
}) => {
  await page.goto("/tutor_topics");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
});
