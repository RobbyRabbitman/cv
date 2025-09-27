import { expect, test } from '../test.js';

test('select a locale', async ({ localeMenu, page }) => {
  const document = page.locator('html');

  await localeMenu.switchLocale('Deutsch');
  await expect(localeMenu.trigger).toHaveAccessibleName('Sprache wählen');
  await expect(document).toHaveAttribute('lang', 'de');

  await localeMenu.switchLocale('English');
  await expect(localeMenu.trigger).toHaveAccessibleName('Select language');
  await expect(document).toHaveAttribute('lang', 'en');
});
