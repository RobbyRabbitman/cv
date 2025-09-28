import { expect, test } from '../test.js';

test('toggle global menu', async ({ globalMenu }) => {
  await globalMenu.toggleButton.click();
  await expect(globalMenu.locator).toBeVisible();

  await globalMenu.toggleButton.click();
  await expect(globalMenu.locator).toBeHidden();
});

test('close global menu', async ({ globalMenu }) => {
  await globalMenu.toggleButton.click();
  await expect(globalMenu.locator).toBeVisible();

  await globalMenu.locator.press('Tab');
  await expect(globalMenu.closeButton).toBeFocused();
  await globalMenu.closeButton.press('Enter');
  await expect(globalMenu.locator).toBeHidden();
});
