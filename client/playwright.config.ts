import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests (critical user journey).
 *
 * Prerequisites (the tests do NOT start them for you):
 *   - the API running on http://localhost:5000 (`cd server && npm run dev`)
 *   - a seeded database (`cd server && npm run seed`)
 *   - the client running on http://localhost:5173 (`cd client && npm run dev`)
 *
 * Run: `npm run test:e2e` (after `npx playwright install chromium`).
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    locale: 'en-US',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
