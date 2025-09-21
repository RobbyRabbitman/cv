import { type Locator, type Page } from '@playwright/test';

export class Auth {
  readonly signInButton: Locator;
  readonly signOutButton: Locator;

  constructor(protected readonly page: Page) {
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.signOutButton = page.getByRole('button', { name: 'Sign out' });
  }

  async isSignedIn() {
    return Promise.any([
      this.signInButton.waitFor({ state: 'visible' }).then(() => false),
      this.signOutButton.waitFor({ state: 'visible' }).then(() => true),
    ]);
  }

  async isSignedOut() {
    return !(await this.isSignedIn());
  }

  async signIn(user?: string | RegExp) {
    if (await this.isSignedIn()) {
      throw new Error('Already signed in');
    }

    const [authPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.signInButton.click(),
    ]);

    if (!user) {
      /** TODO: This only exists with firebase emulators. */
      await authPage
        .getByRole('button', { name: 'Add new account' })
        .click({ timeout: 5_000 });
      await authPage
        .getByRole('button', { name: 'Auto-generate user information' })
        .click({ timeout: 5_000 });
      await authPage
        .getByRole('button', { name: /Sign in/ })
        .click({ timeout: 5_000 });
    } else {
      await authPage.getByText(user).click();
    }

    await this.signOutButton.waitFor({ state: 'visible' });
  }

  async signOut() {
    if (await this.isSignedOut()) {
      throw new Error('Already signed out');
    }

    await this.signOutButton.click();
    await this.signInButton.waitFor({ state: 'visible' });
  }
}
