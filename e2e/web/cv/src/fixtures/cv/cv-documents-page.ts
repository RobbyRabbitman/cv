import { type Locator } from '@playwright/test';
import type { Shell } from '../common/shell.js';

export class CvDocumentsPage {
  protected readonly createButton: Locator;
  protected readonly cvList: Locator;
  protected readonly cv: Locator;

  constructor(protected readonly shell: Shell) {
    this.createButton = shell.main.getByRole('button', { name: 'Create CV' });
    this.cvList = shell.main.getByRole('list');
    this.cv = this.cvList.getByRole('listitem');
  }

  getEditCvButton(name: string | RegExp) {
    return this.cv.getByRole('button', {
      name: new RegExp(
        'Edit document: ' + (typeof name === 'string' ? name : name.source),
      ),
    });
  }

  getDeleteCvButton(name: string | RegExp) {
    return this.cv.getByRole('button', {
      name: new RegExp(
        'Delete document: ' + (typeof name === 'string' ? name : name.source),
      ),
    });
  }

  async goTo() {
    await this.shell.page.goto('/documents');
    await this.createButton.waitFor({ state: 'visible' });
  }

  async createCv() {
    await this.createButton.click();
  }

  async deleteCv(name: string | RegExp) {
    const cv = this.getEditCvButton(name);

    await cv.hover();

    await this.getDeleteCvButton(name).click();
  }
}
