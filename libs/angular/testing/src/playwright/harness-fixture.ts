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
 * A Playwright test with a preconfigured `PlaywrightHarnessEnvironment` and
 * root harness loader. Also expects a `baseURL` to be configured.
 */
export const test = base.extend<HarnessFixture>({
  page: async ({ baseURL, page }, use) => {
    if (!baseURL) {
      throw new Error('When using this fixture you must specify a baseURL');
    }

    await page.goto(baseURL);
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
