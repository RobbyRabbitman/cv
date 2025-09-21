import { type Locator, type Page } from '@playwright/test';

export class LocaleMenu {
  readonly trigger: Locator;
  protected readonly item: Locator;

  constructor(protected readonly page: Page) {
    this.trigger = page.getByTestId('locale-menu').getByRole('button');
    this.item = page.getByTestId(/^locale-menu-item-/);
  }

  getItem(locale: string) {
    return this.item.and(this.page.getByRole('menuitem', { name: locale }));
  }

  async switchLocale(locale: string) {
    const localeItem = this.getItem(locale);

    await this.trigger.click();
    await localeItem.click();
  }
}
