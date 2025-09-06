import { HarnessEnvironment } from '@angular/cdk/testing';
import type { Locator, Page } from 'playwright';
import { PlaywrightTestElement } from './test-element.js';

export class PlaywrightHarnessEnvironment extends HarnessEnvironment<
  () => Locator
> {
  constructor(
    protected readonly page: Page,
    protected readonly root: () => Locator = () => page.locator(':root'),
  ) {
    super(root);
  }

  override async forceStabilize() {
    // we dont wanna depent on zone.js so this is a noop
  }

  override async waitForTasksOutsideAngular() {
    // we dont wanna depent on zone.js so this is a noop
  }

  protected override getDocumentRoot() {
    return this.root;
  }

  protected override createTestElement(element: () => Locator) {
    return new PlaywrightTestElement(element, () => this.forceStabilize());
  }

  protected override createEnvironment(element: () => Locator) {
    return new PlaywrightHarnessEnvironment(this.page, element);
  }

  protected override async getAllRawElements(selector: string) {
    const locators = await this.root().locator(selector).all();
    return locators.map((locator) => () => locator);
  }
}
