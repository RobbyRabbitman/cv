import { type Locator } from '@playwright/test';
import type { Shell } from './shell.js';

export class CvDocumentsPage {
  protected readonly createButton: Locator;
  protected readonly cvList: Locator;
  protected readonly cv: Locator;

  constructor(protected readonly shell: Shell) {
    this.createButton = shell.main.getByRole('button', { name: 'Create CV' });
    this.cvList = shell.main.getByRole('list');
    this.cv = this.cvList.getByRole('listitem');
  }

  getCv(name: string | RegExp) {
    return this.cv.getByRole('button', { name });
  }

  async goTo() {
    await this.shell.page.goto('/documents');
    await this.createButton.waitFor({ state: 'visible' });
  }

  async createCv() {
    await this.createButton.click();
  }
}
