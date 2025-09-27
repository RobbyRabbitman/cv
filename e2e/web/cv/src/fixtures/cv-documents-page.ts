import { type Locator } from '@playwright/test';
import type { Shell } from './shell.js';

export class CvDocumentsPage {
  protected readonly createButton: Locator;

  constructor(protected readonly shell: Shell) {
    this.createButton = shell.main.getByRole('button', { name: 'Create CV' });
  }

  getCv(name: string | RegExp) {
    return this.shell.main.getByRole('button', { name });
  }

  async goTo() {
    await this.shell.page.goto('/documents');
    await this.createButton.waitFor({ state: 'visible' });
  }

  async createCv() {
    await this.createButton.click();
  }
}
