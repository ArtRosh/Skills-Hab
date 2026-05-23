import { test, expect } from "@playwright/test";
import {
  createStudentWithRequest,
  createTutorWithService,
  disposeContexts,
  login,
  uniqueValue,
  updateRequestStatus,
} from "./helpers/testHelpers";

test("chat is blocked before a request is accepted", async ({ page }) => {
  const tutor = await createTutorWithService({
    topic: {
      topic: uniqueValue("chat-guard-topic"),
      description: "Chat guard topic",
    },
    service: {
      rate: 90,
      description: uniqueValue("chat-guard-service"),
    },
  });
  const student = await createStudentWithRequest(tutor.service.id!, {
    request: { description: uniqueValue("chat-guard-request") },
  });

  try {
    await login(page, student.user);
    await page.goto(`/requests/${student.request.id}/chat`);

    await expect(page.locator(".alert-danger")).toContainText(
      "Chat is only available after the request is accepted"
    );
  } finally {
    await disposeContexts(tutor.api, student.api);
  }
});

test("accepted requests can send chat messages", async ({ page }) => {
  const messageText = uniqueValue("chat-message");
  const tutor = await createTutorWithService({
    topic: {
      topic: uniqueValue("chat-topic"),
      description: "Chat topic",
    },
    service: {
      rate: 95,
      description: uniqueValue("chat-service"),
    },
  });
  const student = await createStudentWithRequest(tutor.service.id!, {
    request: { description: uniqueValue("chat-request") },
  });

  try {
    await updateRequestStatus(tutor.api, student.request.id!, "accepted");

    await login(page, student.user);
    await page.goto(`/requests/${student.request.id}/chat`);

    await expect(page.getByRole("heading", { name: /chat/i })).toBeVisible();
    await page.getByPlaceholder("Write a message...").fill(messageText);
    await page.getByRole("button", { name: /send/i }).click();

    await expect(page.getByText(messageText)).toBeVisible({ timeout: 10000 });
  } finally {
    await disposeContexts(tutor.api, student.api);
  }
});
