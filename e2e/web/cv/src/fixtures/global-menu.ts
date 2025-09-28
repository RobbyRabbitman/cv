import type { Locator } from '@playwright/test';
import type { Shell } from './shell.js';

export class GlobalMenu {
  readonly locator: Locator;
  readonly toggleButton: Locator;
  readonly closeButton: Locator;

  constructor(readonly shell: Shell) {
    this.locator = this.shell.page.getByRole('complementary', {
      name: 'Global menu',
    });

    this.closeButton = this.locator.getByRole('button', {
      name: 'Close global menu',
    });

    this.toggleButton = this.shell.header.getByRole('button', {
      name: /(Open|Close) global menu/,
    });
  }
}
