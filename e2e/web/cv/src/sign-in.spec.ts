import { expect, test } from '@robby-rabbitman/cv-tools-playwright-harness';

test('sign in', async ({ page }) => {
  const signInButton = page.getByRole('button', { name: 'Sign in' });
  const signOutButton = page.getByRole('button', { name: 'Sign out' });

  const [authPage] = await Promise.all([
    page.waitForEvent('popup'),
    signInButton.click(),
  ]);

  await authPage.getByText(/Mountain Olive/).click();
  await expect(signOutButton).toBeVisible();
});
