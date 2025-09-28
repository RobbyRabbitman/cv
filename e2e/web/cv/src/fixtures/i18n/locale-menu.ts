import { type Locator } from '@playwright/test';
import type { Shell } from '../common/shell.js';

export class LocaleMenu {
  readonly trigger: Locator;
  protected readonly item: Locator;

  constructor(protected readonly shell: Shell) {
    this.trigger = shell.header.getByTestId('locale-menu').getByRole('button');

    /** We cannot use the header locator because of cdk-overlay */
    this.item = shell.page.getByTestId(/^locale-menu-item-/);
  }

  getItem(locale: string) {
    return this.item.and(
      this.shell.page.getByRole('menuitem', { name: locale }),
    );
  }

  async switchLocale(locale: string) {
    const localeItem = this.getItem(locale);

    await this.trigger.click();
    await localeItem.click();
  }
}
