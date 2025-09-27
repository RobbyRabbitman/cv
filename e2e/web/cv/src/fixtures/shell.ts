import type { Locator, Page } from '@playwright/test';

export class Shell {
  public readonly header: Locator;
  public readonly main: Locator;
  public readonly footer: Locator;

  constructor(public readonly page: Page) {
    this.header = page.getByRole('banner');
    this.main = page.getByRole('main');
    this.footer = page.getByRole('contentinfo');
  }
}
