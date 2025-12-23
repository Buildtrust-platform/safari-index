import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Safari Index visual smoke tests.
 *
 * Run with: npx playwright test
 * Run with UI: npx playwright test --ui
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Mobile Chrome emulation - no WebKit install needed
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'ENABLE_DEV_PAGES=true NEXT_PUBLIC_APP_MODE=build npm run dev',
    url: 'http://localhost:3000',
    // Never reuse existing server to ensure ENABLE_DEV_PAGES and NEXT_PUBLIC_APP_MODE are set correctly
    reuseExistingServer: false,
  },
});
