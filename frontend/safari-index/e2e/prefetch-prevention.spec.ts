import { test, expect } from '@playwright/test';

/**
 * Prefetch Prevention Tests
 *
 * Verifies that:
 * 1. Visiting /decisions does NOT trigger /decision/evaluate API calls
 * 2. Clicking a decision link triggers exactly one evaluation call
 * 3. Navigation from hub to decision page works correctly
 *
 * These tests ensure we prevent evaluation stampedes from prefetching.
 */

test.describe('Prefetch Prevention', () => {
  test('visiting /decisions does NOT call /decision/evaluate', async ({ page }) => {
    // Track all API calls to the decision endpoint
    const evaluateCalls: string[] = [];

    await page.route('**/decision/evaluate', async (route) => {
      evaluateCalls.push(route.request().url());
      // Don't actually call the API, just track the request
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_test_mock',
          output: {
            type: 'decision',
            decision: {
              outcome: 'book',
              headline: 'Test decision',
              summary: 'This is a test decision for prefetch prevention testing.',
              assumptions: [
                { id: 'a1', text: 'Test assumption', confidence: 0.8 },
                { id: 'a2', text: 'Another assumption', confidence: 0.7 },
              ],
              tradeoffs: { gains: ['Gain 1'], losses: ['Loss 1'] },
              change_conditions: ['Condition 1', 'Condition 2'],
              confidence: 0.75,
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: false, retry_count: 0, persisted: true },
        }),
      });
    });

    // Navigate to decisions hub
    await page.goto('/decisions');

    // Wait for page to fully load
    await expect(page.getByTestId('decisions-h1')).toBeVisible();

    // Wait a bit for any prefetch requests to trigger
    await page.waitForTimeout(2000);

    // Verify NO evaluation calls were made
    expect(evaluateCalls).toHaveLength(0);
  });

  test('visiting /explore does NOT call /decision/evaluate', async ({ page }) => {
    const evaluateCalls: string[] = [];

    await page.route('**/decision/evaluate', async (route) => {
      evaluateCalls.push(route.request().url());
      await route.abort(); // Abort any prefetch attempts
    });

    await page.goto('/explore');

    // Wait for page to fully load
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Wait for any prefetch requests
    await page.waitForTimeout(2000);

    // Verify NO evaluation calls were made
    expect(evaluateCalls).toHaveLength(0);
  });

  test('visiting homepage does NOT call /decision/evaluate', async ({ page }) => {
    const evaluateCalls: string[] = [];

    await page.route('**/decision/evaluate', async (route) => {
      evaluateCalls.push(route.request().url());
      await route.abort();
    });

    await page.goto('/');

    // Wait for page to fully load
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Wait for any prefetch requests
    await page.waitForTimeout(2000);

    // Verify NO evaluation calls were made
    expect(evaluateCalls).toHaveLength(0);
  });

  test('clicking a decision link triggers evaluation call (not prefetch)', async ({ page }) => {
    let evaluateCallCount = 0;

    await page.route('**/decision/evaluate', async (route) => {
      evaluateCallCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_test_single',
          output: {
            type: 'decision',
            decision: {
              outcome: 'book',
              headline: 'February is excellent for Tanzania',
              summary: 'The dry season conditions provide optimal viewing.',
              assumptions: [
                { id: 'a1', text: 'Test assumption one', confidence: 0.8 },
                { id: 'a2', text: 'Test assumption two', confidence: 0.7 },
              ],
              tradeoffs: { gains: ['Great weather'], losses: ['Higher prices'] },
              change_conditions: ['If dates change', 'If budget changes'],
              confidence: 0.75,
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: true, retry_count: 0, persisted: true },
        }),
      });
    });

    // Go to decisions hub
    await page.goto('/decisions');
    await expect(page.getByTestId('decisions-h1')).toBeVisible();

    // Count should still be 0 (no prefetch)
    expect(evaluateCallCount).toBe(0);

    // Click first topic link
    const firstTopicLink = page.getByTestId('topic-link').first();
    await firstTopicLink.click();

    // Wait for the decision page to make its request
    await page.waitForTimeout(2000);

    // Should have at least one call (React StrictMode may cause double-mount in dev)
    // The key assertion is that NO calls happen before clicking
    expect(evaluateCallCount).toBeGreaterThanOrEqual(1);
    // But should be bounded (not 10+ from prefetch stampede)
    expect(evaluateCallCount).toBeLessThanOrEqual(2);
  });

  test('scrolling through decisions list does not trigger evaluation calls', async ({ page }) => {
    const evaluateCalls: string[] = [];

    await page.route('**/decision/evaluate', async (route) => {
      evaluateCalls.push(route.request().url());
      await route.abort();
    });

    await page.goto('/decisions');
    await expect(page.getByTestId('decisions-h1')).toBeVisible();

    // Scroll through the entire page
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(1000);

    // Even after scrolling through all topics, no evaluation calls
    expect(evaluateCalls).toHaveLength(0);
  });
});

test.describe('Decision Navigation', () => {
  test('navigating from decisions hub to decision page works', async ({ page }) => {
    // Mock the API response
    await page.route('**/decision/evaluate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          decision_id: 'dec_nav_test',
          output: {
            type: 'decision',
            decision: {
              outcome: 'book',
              headline: 'Navigation test successful',
              summary: 'This decision page loaded correctly after navigation.',
              assumptions: [
                { id: 'a1', text: 'User navigated correctly', confidence: 0.9 },
                { id: 'a2', text: 'Page rendered properly', confidence: 0.85 },
              ],
              tradeoffs: { gains: ['Fast load'], losses: ['None'] },
              change_conditions: ['If navigation breaks', 'If API fails'],
              confidence: 0.85,
            },
          },
          metadata: { logic_version: 'v1.0', ai_used: true, retry_count: 0, persisted: true },
        }),
      });
    });

    // Start at decisions hub
    await page.goto('/decisions');
    await expect(page.getByTestId('decisions-h1')).toBeVisible();

    // Click a topic link
    const topicLink = page.getByTestId('topic-link').first();
    const href = await topicLink.getAttribute('href');
    await topicLink.click();

    // Should navigate to decision page
    await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

    // Decision page content should load
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('Navbar Decisions link works correctly', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      // On mobile, need to open the hamburger menu first
      await page.getByTestId('navbar-mobile-toggle').click();
      await page.getByTestId('navbar-mobile-menu').getByText('Decisions').click();
    } else {
      // Click Decisions in navbar
      await page.getByTestId('navbar-link-decisions').click();
    }

    // Should navigate to /decisions
    await expect(page).toHaveURL('/decisions');
    await expect(page.getByTestId('decisions-h1')).toBeVisible();
  });
});
