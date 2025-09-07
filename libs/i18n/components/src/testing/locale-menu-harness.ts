import { ComponentHarness } from '@angular/cdk/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';

export class LocaleMenuHarness extends ComponentHarness {
  static hostSelector = 'cv-i18n--locale-menu';

  protected getMenuHarness = this.locatorFor(MatMenuHarness);

  async getTriggerText() {
    return (await this.getMenuHarness()).getTriggerText();
  }

  async open() {
    return (await this.getMenuHarness()).open();
  }

  async isOpen() {
    return (await this.getMenuHarness()).isOpen();
  }

  async hasLocale(text?: string, exact = true) {
    const menu = await this.getMenuHarness();
    const items = await menu.getItems({ text });

    return exact ? items.length === 1 : items.length > 0;
  }

  async clickItem(text: string | RegExp) {
    return (await this.getMenuHarness()).clickItem({ text });
  }
}
