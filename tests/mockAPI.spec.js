import { test, expect, request } from "@playwright/test";
import tags from '../test-data/tags.json'
test.beforeEach(async ({page}) => {

    // Mock API
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags),
        });
    })

    await page.goto('https://angular.realworld.how/');
})

test('Has title', async ({page}) => {
    // Modify API Response
    await page.route('*/**/api/articles*', async route => {
        const response = await route.fetch();
        const responseBody = await response.json();
        responseBody.articles[0].title = 'This is a MOCK title';
        responseBody.articles[0].description = 'This is a MOCK description';

        await route.fulfill({
            body: JSON.stringify(responseBody),
        })
    })
    await page.getByText('Global Feed').click();
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK title');
    await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK description');
})

// Perform API Request
test('Delete article', async ({page, request}) => {
    const response = await request.post('https://api.realworld.io/api/users/login', {
    data: {
      "user": {"email": "pwtest@test.com", "password": "Welcome1"}
    }
  });
  const responseBody = await response.json();
  const accessToken = responseBody.user.token;

  const articleResponse = await request.post('https://api.realworld.io/api/articles', {
    data: {
      "article": {"tagList": [], "title": "This is a test title", "description": "This is a MOCK description", "body": "This is a test body"}
    },
    headers: {
      Authorization: `Token ${accessToken}`,
    }
  })
  expect(articleResponse.status()).toEqual(201);

  await page.getByText('Global Feed').click();
  await page.getByText('This is a test title').click();
  await page.getByRole('button', {name: "Delete Article"}).first().click();
  await page.getByText('Global Feed').click();
  await expect(page.locator("app-article-list h1").first()).not.toContainText("This is a test title");
  await expect(page.locator("app-article-list p").first()).not.toContainText("This is a MOCK description");
})

// Intercept Browser API Response
test('Create article', async ({page, request}) => {
    await page.getByText('New Article').click();
    await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright is awesome');
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About the playwright');
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('We like to use playwright for automation');
    await page.getByRole('button', {name: 'Publish Article'}).click();

    const articleResponse = await page.waitForResponse('https://api.realworld.io/api/articles/');
    const articleResponseBody = await articleResponse.json();
    const slugId = articleResponseBody.article.slug;

    await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome');
    await page.getByText('Home').click();
    await page.getByText('Global Feed').click();

    await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome');

    const response = await request.post('https://api.realworld.io/api/users/login/', {
        data: {
            "user": {"email": "pwtest@test.com", "password": "Welcome1"}
        }
    });

    const responseBody = await response.json();
    const accessToken = responseBody.user.token;

    const deleteArticleResponse = await request.delete(`https://api.realworld.io/api/articles/${slugId}`, {
        headers: {
            Authorization: `Token ${accessToken}`,
          }
    });

    expect(deleteArticleResponse.status()).toEqual(204);
})