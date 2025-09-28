import { expect, test } from '../test.js';

test('sign in', async ({ auth, page }) => {
  await expect(page).toHaveURL('/');

  await auth.signIn();

  await expect(auth.signInButton).toBeHidden();
  await expect(auth.signOutButton).toBeVisible();
  await expect(page).toHaveURL('documents');
});
