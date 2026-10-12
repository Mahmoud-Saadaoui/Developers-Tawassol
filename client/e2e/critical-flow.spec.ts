import { expect, test } from '@playwright/test';

/**
 * Critical journey: register → ask → answer → vote → accept.
 *
 * Requires a seeded database (at least one tag, e.g. "JavaScript").
 */
test('a developer can register, ask, answer, vote and accept', async ({ page }) => {
  const email = `e2e-${Date.now()}@tawassol.dev`;
  const questionTitle = `E2E question ${Date.now()}`;
  const questionBody =
    'This is a sufficiently long question body written by the e2e test.';
  const answerBody = 'This is a sufficiently long answer body provided by the e2e test.';

  // ── Register ──
  await page.goto('/register');
  await page.locator('#name').fill('E2E Developer');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill('password123');
  await page.getByRole('button', { name: 'Sign up' }).click();

  // Redirected home + authenticated navigation.
  await expect(page.getByRole('link', { name: 'Ask a question' }).first()).toBeVisible();

  // ── Ask a question ──
  await page.goto('/ask');
  await page.getByPlaceholder('Title').fill(questionTitle);
  await page.getByPlaceholder(/Describe your question/).fill(questionBody);

  // Pick the first available tag.
  await page.locator('.ant-select-selector').click();
  await page.locator('.ant-select-item-option').first().click();

  await page.getByRole('button', { name: 'Publish' }).click();

  // ── Question detail ──
  await expect(page).toHaveURL(/\/questions\/[a-f0-9]+/);
  await expect(page.getByRole('heading', { name: questionTitle })).toBeVisible();

  // ── Answer ──
  await page.getByPlaceholder(/Write your answer/).fill(answerBody);
  await page.getByRole('button', { name: 'Publish answer' }).click();
  await expect(page.getByText(answerBody)).toBeVisible();

  // ── Vote on the question ──
  const questionUpvote = page.getByRole('button', { name: 'Upvote' }).first();
  await questionUpvote.click();
  await expect(page.getByText('1', { exact: true }).first()).toBeVisible();

  // ── Accept the answer ──
  await page.getByRole('button', { name: 'Accept' }).first().click();
  await expect(page.getByText('Accepted answer')).toBeVisible();
});
