// @ts-check
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("*/**/tags", async (route) => {
    const tags = {
      tags: ["automation", "playwright"],
    };
    await route.fulfill({
      body: JSON.stringify(tags),
    });
  });

  // await page.route("*/**/api/articles*", async (route) => {
  //   const response = await route.fetch();
  //   const responseBody = await response.json();
  //   responseBody.articles[0].title = "This is a test title";
  //   responseBody.articles[0].description = "This is a test description";

  //   await route.fulfill({
  //     body: JSON.stringify(responseBody),
  //   });
  // });
  await page.goto("https://angular.realworld.how");
  // await page.goto("https://commitquality.com/practice-api");
  // await page.getByText('Sign in').click();
  // await page.getByRole('textbox', {name: 'Email'}).fill('pwtest@test.com');
  // await page.getByRole('textbox', {name: 'Password'}).fill('Welcome1');
  // await page.getByRole('button').click();

});

test("has Title", async ({ page }) => {
  // await expect(page.locator(".navbar-brand")).toHaveText("conduit");
  await expect(page.getByText('automation')).toBeVisible();
});


// test("edit response api", async ({ page }) => {
//   await expect(page.locator("app-article-list h1").first()).toContainText("This is a test title");
//   await expect(page.locator("app-article-list p").first()).toContainText("This is a test description");
// });

// test("delete article", async ({ page, request }) => {
 
// });

