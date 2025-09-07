import { expect, test } from '@robby-rabbitman/cv-tools-playwright-harness';

test('select a locale', async ({ page }) => {
  const trigger = page.getByTestId('locale-menu').getByRole('button');
  const item = page.getByTestId(/^locale-menu-item-/);
  const english = item.and(page.getByRole('menuitem', { name: 'English' }));
  const german = item.and(page.getByRole('menuitem', { name: 'Deutsch' }));

  await trigger.click();
  await german.click();
  await expect(trigger).toHaveAccessibleName('Deutsch');

  await trigger.click();
  await english.click();
  await expect(trigger).toHaveAccessibleName('English');
});
