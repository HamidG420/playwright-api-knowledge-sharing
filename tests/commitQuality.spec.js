// @ts-check
import { test, expect } from "@playwright/test";

// CommitQuality mock API practice
test('mock commit', async ({ page }) => {
  await page.goto("https://commitquality.com/practice-api");
  await page.route("https://jsonplaceholder.typicode.com/todos/1", async (route) => {
    const response = await route.fetch();
    const responseBody = await response.json();
    responseBody.title = "Gol Gol Golrang";
    await route.fulfill({
      body: JSON.stringify(responseBody),
    });
  });
  await page.getByTestId('get-button').click();

  await expect(page.getByText('Gol Gol Golrang')).toBeVisible();

});


