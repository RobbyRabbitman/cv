import { type Locator, type Page } from '@playwright/test';

export class CvDocumentsPage {
  protected readonly createButton: Locator;

  constructor(protected readonly page: Page) {
    this.createButton = page.getByRole('button', { name: 'Create CV' });
  }

  getCv(name: string | RegExp) {
    return this.page.getByRole('button', { name });
  }

  async goTo() {
    await this.page.goto('/documents');
    await this.createButton.waitFor({ state: 'visible' });
  }

  async createCv() {
    await this.createButton.click();
  }
}
