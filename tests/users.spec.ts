import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Users Page E2E & Accessibility (A11y) Verification', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the target page before each test execution
    await page.goto('/users');
  });

  test('should successfully render the users page layout and title', async ({ page }) => {
    // Validate page URL routing and DOM visibility
    await expect(page).toHaveURL(/.*users/);
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
  });

  test('should satisfy WCAG 2.1 AA accessibility standards via axe-core', async ({ page }) => {
    // Execute accessibility analysis using modern AxeBuilder pattern
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Assert that zero accessibility violations exist
    expect(accessibilityScanResults.violations).toEqual([]);
  });

});