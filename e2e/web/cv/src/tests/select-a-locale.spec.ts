import { expect, test } from '../test.js';

test('select a locale', async ({ localeMenu }) => {
  await localeMenu.switchLocale('Deutsch');
  await expect(localeMenu.trigger).toHaveAccessibleName('Sprache wählen');

  await localeMenu.switchLocale('English');
  await expect(localeMenu.trigger).toHaveAccessibleName('Select language');
});
