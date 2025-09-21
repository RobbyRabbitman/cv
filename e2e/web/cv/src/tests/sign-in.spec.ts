import { expect, test } from '../test.js';

test('sign in', async ({ auth }) => {
  await auth.signIn();

  await expect(auth.signInButton).toBeHidden();
  await expect(auth.signOutButton).toBeVisible();
});
