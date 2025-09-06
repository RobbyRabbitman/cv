import { LogoHarness } from '@robby-rabbitman/cv-libs-common-features-shell/testing';
import { expect, test } from '@robby-rabbitman/cv-tools-playwright-harness';

test('has logo', async ({ harness }) => {
  const logo = await harness.loader.getHarness(LogoHarness);

  expect(await logo.text()).toBe('EasyCv');
});
