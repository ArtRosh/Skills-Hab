import { test, expect } from "@playwright/test";
import {
  createTutorWithService,
  createUser,
  createTopic,
  disposeContexts,
  login,
  uniqueValue,
} from "./helpers/testHelpers";

test("tutor can create a service", async ({ page }) => {
  const tutor = await createUser("tutor");
  const topicName = uniqueValue("playwright-topic");
  const serviceDescription = uniqueValue("playwright-service");

  try {
    const topic = await createTopic(tutor.api, {
      topic: topicName,
      description: "Playwright topic description",
    });

    await login(page, tutor.user);
    await page.goto("/tutor_topics");
    await page.getByRole("button", { name: /add service/i }).click();

    const modal = page.locator(".modal-content");
    const topicSelect = modal.getByLabel("Topic");
    await expect(topicSelect).toContainText(topicName);
    await topicSelect.selectOption({ label: topicName });
    await modal.getByLabel(/Rate/).fill("55");
    await modal.getByLabel("Description").fill(serviceDescription);
    await modal.getByRole("button", { name: /^Add Service$/ }).click();

    await expect(page.getByText(topicName)).toBeVisible();
    await expect(page.getByText(serviceDescription)).toBeVisible();
    await expect(page.getByText("$55/hour")).toBeVisible();
  } finally {
    await disposeContexts(tutor.api);
  }
});

test("tutor can edit an existing service", async ({ page }) => {
  const originalDescription = uniqueValue("original-service");
  const updatedDescription = uniqueValue("updated-service");
  const tutor = await createTutorWithService({
    topic: {
      topic: uniqueValue("edit-topic"),
      description: "Edit topic description",
    },
    service: {
      rate: 40,
      description: originalDescription,
    },
  });

  try {
    await login(page, tutor.user);
    await page.goto("/tutor_topics");

    const serviceCard = page
      .locator(".border.rounded.p-3.bg-light")
      .filter({ hasText: originalDescription })
      .first();

    await serviceCard.getByRole("button", { name: /manage service/i }).click();

    const modal = page.locator(".modal-content");
    await modal.getByLabel(/Rate/).fill("65");
    await modal.getByLabel("Description").fill(updatedDescription);
    await modal.getByRole("button", { name: /save changes/i }).click();

    await expect(page.getByText(updatedDescription)).toBeVisible();
    await expect(page.getByText("$65/hour")).toBeVisible();
  } finally {
    await disposeContexts(tutor.api);
  }
});

test("tutor can delete an existing service", async ({ page }) => {
  const serviceDescription = uniqueValue("delete-service");
  const tutor = await createTutorWithService({
    topic: {
      topic: uniqueValue("delete-topic"),
      description: "Delete topic description",
    },
    service: {
      rate: 45,
      description: serviceDescription,
    },
  });

  try {
    await login(page, tutor.user);
    await page.goto("/tutor_topics");

    page.once("dialog", (dialog) => dialog.accept());

    const serviceCard = page
      .locator(".border.rounded.p-3.bg-light")
      .filter({ hasText: serviceDescription })
      .first();

    await serviceCard.getByRole("button", { name: /manage service/i }).click();

    const modal = page.locator(".modal-content");
    await modal.getByRole("button", { name: /delete service/i }).click();

    await expect(page.getByText(serviceDescription)).toHaveCount(0);
  } finally {
    await disposeContexts(tutor.api);
  }
});
