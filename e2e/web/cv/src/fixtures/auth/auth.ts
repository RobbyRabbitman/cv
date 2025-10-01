import { expect, type Locator } from '@playwright/test';
import type { Shell } from '../common/shell.js';

export class Auth {
  readonly signInButton: Locator;
  readonly signOutButton: Locator;

  constructor(protected readonly shell: Shell) {
    this.signInButton = shell.header.getByRole('button', { name: 'Sign in' });
    this.signOutButton = shell.header.getByRole('button', { name: 'Sign out' });
  }

  async isSignedIn() {
    return Promise.race([
      this.signInButton
        .waitFor({ state: 'visible', timeout: 5_000 })
        .then(() => false),
      this.signOutButton
        .waitFor({ state: 'visible', timeout: 5_000 })
        .then(() => true),
    ]);
  }

  async isSignedOut() {
    return !(await this.isSignedIn());
  }

  async signIn(user?: string | RegExp) {
    user ??= /Mountain Olive/;

    if (await this.isSignedIn()) {
      return;
    }

    const [authPage] = await Promise.all([
      this.shell.page.waitForEvent('popup'),
      this.signInButton.click(),
    ]);

    if (!user) {
      /** TODO: This only exists with firebase emulators. */
      await authPage.getByRole('button', { name: 'Add new account' }).click();
      await authPage
        .getByRole('button', { name: 'Auto-generate user information' })
        .click();
      await authPage.getByRole('button', { name: /Sign in/ }).click();
    } else {
      await authPage.getByText(user).click();
    }

    await expect(this.signInButton).toBeHidden();
    await expect(this.signOutButton).toBeVisible();
  }

  async signOut() {
    if (await this.isSignedOut()) {
      return;
    }

    await this.signOutButton.click();

    await expect(this.signInButton).toBeVisible();
    await expect(this.signOutButton).toBeHidden();
  }
}
