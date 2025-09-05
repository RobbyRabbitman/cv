import { expect, test } from '@playwright/test';

test('has logo', async ({ page }) => {
  await page.goto('.');
  await expect(page.locator('cv-common--shell-logo')).toHaveText('EasyCv');
});
