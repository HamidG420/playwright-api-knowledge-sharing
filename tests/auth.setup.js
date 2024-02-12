import { test as setup, expect } from "@playwright/test";
import user from "../.auth/user.json";
import fs from "fs";

const authFile = ".auth/user.json";

setup("authentication", async ({ request }) => {
  /* ************
  Basic authentication: shared account in all tests
  ************ */
  // await page.goto("https://angular.realworld.how");
  // await page.getByText('Sign in').click();
  // await page.getByRole('textbox', {name: 'Email'}).fill('pwtest@test.com');
  // await page.getByRole('textbox', {name: 'Password'}).fill('Welcome1');
  // await page.getByRole('button').click();
  // await page.waitForResponse('https://api.realworld.io/api/tags');

  /* ************
  Authentication practice: commitQuality
  ************ */
  // await page.context().storageState({path: authFile});
  // await page.goto("https://commitquality.com/login");
  // await page.locator('[data-testid="username-textbox"]').fill("test");
  // await page.locator('[data-testid="password-textbox"]').fill("test");
  // await page.locator('[data-testid="login-button"]').click();

  // await expect(page.locator('[data-testid="navbar-logout"]')).toBeVisible();

  // await page.context().storageState({ path: authFile });

  /* ************
  Authenticate with API request
  ************ */
  const response = await request.post('https://api.realworld.io/api/users/login', {
    data: {
      "user": {"email": "pwtest@test.com", "password": "Welcome1"}
    }
  });
  const responseBody = await response.json();
  const accessToken = responseBody.user.token;
  user.origins[0].localStorage[0].value = accessToken;
  fs.writeFileSync(authFile, JSON.stringify(user));

  process.env['ACCESS_TOKEN'] = accessToken;
});
