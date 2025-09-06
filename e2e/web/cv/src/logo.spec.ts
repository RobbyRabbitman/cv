import { expect, test } from '@playwright/test';
import { PlaywrightHarnessEnvironment } from '@robby-rabbitman/cv-libs-angular-testing/playwright';
import { LogoHarness } from '@robby-rabbitman/cv-libs-common-features-shell/testing';

test('has logo', async ({ page }) => {
  await page.goto('.');

  const env = new PlaywrightHarnessEnvironment(page);
  const loader = await env.rootHarnessLoader();
  const logo = await loader.getHarness(LogoHarness);

  expect(await logo.text()).toBe('EasyCv');
});
