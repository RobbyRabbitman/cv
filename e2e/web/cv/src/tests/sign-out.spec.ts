import { expect, test } from '../test.js';

test('sign out', async ({ auth }) => {
  await auth.signIn();

  await auth.signOut();
  await expect(auth.signOutButton).toBeHidden();
  await expect(auth.signInButton).toBeVisible();
});
