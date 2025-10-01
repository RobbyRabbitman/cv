import { expect, test } from '../test.js';

test('logo', async ({ page, shell, auth, cvDocumentsPage }) => {
  await auth.signIn();
  await cvDocumentsPage.goTo();
  await expect(page).not.toHaveURL('/');

  await shell.logo.click();
  await expect(page).toHaveURL('/');
});
