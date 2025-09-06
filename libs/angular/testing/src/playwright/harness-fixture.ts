import type { HarnessLoader } from '@angular/cdk/testing';
import { test as base } from '@playwright/test';
import { PlaywrightHarnessEnvironment } from './harness-environment';

interface HarnessFixture {
  harness: {
    env: PlaywrightHarnessEnvironment;
    loader: HarnessLoader;
  };
}

/**
 * A Playwright test with
 *
 * - A page that navigates to the `baseURL` before each test
 * - A `harness` environment and root loader
 */
export const test = base.extend<HarnessFixture>({
  page: async ({ baseURL, page }, use) => {
    if (baseURL) {
      await page.goto(baseURL);
    }

    await use(page);
  },

  harness: async ({ page }, use) => {
    const env = new PlaywrightHarnessEnvironment(page);
    const loader = await env.rootHarnessLoader();

    await use({
      env,
      loader,
    });
  },
});

export { expect } from '@playwright/test';
