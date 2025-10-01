import type { Locator, Page } from '@playwright/test';

export class Shell {
  readonly header: Locator;
  readonly main: Locator;
  readonly footer: Locator;
  readonly logo: Locator;

  constructor(readonly page: Page) {
    this.header = page.getByRole('banner');
    this.main = page.getByRole('main');
    this.footer = page.getByRole('contentinfo');

    this.logo = this.header.getByRole('link', { name: 'Homepage' });
  }
}
