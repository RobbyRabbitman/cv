import { expect, test } from '../test.js';

test('toggle global menu', async ({ globalMenu }) => {
  await globalMenu.toggleButton.click();
  await expect(globalMenu.locator).toBeVisible();

  await globalMenu.toggleButton.click();
  await expect(globalMenu.locator).toBeHidden();
});
