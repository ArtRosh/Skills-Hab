import { test, expect } from "@playwright/test";
import {
  createTutorWithService,
  createUser,
  disposeContexts,
  login,
  uniqueValue,
} from "./helpers/testHelpers";

test("student can submit a service request", async ({ page }) => {
  const topicName = uniqueValue("student-topic");
  const serviceDescription = uniqueValue("student-service");
  const requestNote = uniqueValue("request-note");
  const tutor = await createTutorWithService({
    topic: {
      topic: topicName,
      description: "Student flow topic",
    },
    service: {
      rate: 70,
      description: serviceDescription,
    },
  });
  const student = await createUser("student");

  try {
    await login(page, student.user);
    await page.goto("/topics");

    const topicCard = page
      .locator(".card")
      .filter({ hasText: topicName })
      .first();
    await expect(topicCard).toBeVisible();
    await topicCard.getByRole("button", { name: /request/i }).click();

    const modal = page.locator(".modal-content");
    await modal.getByLabel(/Note/).fill(requestNote);
    await modal.getByRole("button", { name: /send request/i }).click();

    await expect(page.getByRole("heading", { name: /my requests/i })).toBeVisible();
    await expect(page.getByText(requestNote)).toBeVisible();
    await expect(page.getByText("pending")).toBeVisible();
    await expect(page.getByText(serviceDescription)).toBeVisible();
  } finally {
    await disposeContexts(tutor.api, student.api);
  }
});
