import { test, expect } from "@playwright/test";
import {
  createStudentWithRequest,
  createTutorWithService,
  disposeContexts,
  login,
  uniqueValue,
} from "./helpers/testHelpers";

test("tutor can accept a request", async ({ page }) => {
  const requestDescription = uniqueValue("accept-request");
  const tutor = await createTutorWithService({
    topic: {
      topic: uniqueValue("accept-topic"),
      description: "Tutor acceptance topic",
    },
    service: {
      rate: 80,
      description: uniqueValue("accept-service"),
    },
  });
  const student = await createStudentWithRequest(tutor.service.id!, {
    request: { description: requestDescription },
  });

  try {
    await login(page, tutor.user);
    await page.goto(
      `/tutor/topic/${tutor.topic.id}/service/${tutor.service.id}/requests`
    );

    const requestCard = page
      .locator(".card")
      .filter({ hasText: requestDescription })
      .first();
    await requestCard.getByRole("button", { name: /accept/i }).click();

    await expect(requestCard.getByText("accepted")).toBeVisible();
    await expect(
      requestCard.getByRole("button", { name: /open chat/i })
    ).toBeVisible();
  } finally {
    await disposeContexts(tutor.api, student.api);
  }
});

test("tutor can reject a request", async ({ page }) => {
  const requestDescription = uniqueValue("reject-request");
  const tutor = await createTutorWithService({
    topic: {
      topic: uniqueValue("reject-topic"),
      description: "Tutor rejection topic",
    },
    service: {
      rate: 65,
      description: uniqueValue("reject-service"),
    },
  });
  const student = await createStudentWithRequest(tutor.service.id!, {
    request: { description: requestDescription },
  });

  try {
    await login(page, tutor.user);
    await page.goto(
      `/tutor/topic/${tutor.topic.id}/service/${tutor.service.id}/requests`
    );

    const requestCard = page
      .locator(".card")
      .filter({ hasText: requestDescription })
      .first();
    await requestCard.getByRole("button", { name: /reject/i }).click();

    await expect(requestCard.getByText("rejected")).toBeVisible();
  } finally {
    await disposeContexts(tutor.api, student.api);
  }
});
