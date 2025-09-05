import { HarnessEnvironment } from '@angular/cdk/testing';
import type { Locator, Page } from 'playwright';
import { PlaywrightTestElement } from './playwright-test-element';

export class PlaywrightHarnessEnvironment extends HarnessEnvironment<
  () => Locator
> {
  constructor(
    protected readonly page: Page,
    protected readonly root: () => Locator = () => page.locator(':root'),
  ) {
    super(root);
  }

  async waitForAngularReady() {
    await this.page.waitForFunction(isBootstrapped);
    await this.forceStabilize();
  }

  override async forceStabilize() {
    await this.page.evaluate(whenStable);
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

/**
 * Copy Pasta from:
 * https://github.com/angular/components/blob/main/src/cdk/testing/selenium-webdriver/selenium-web-driver-harness-environment.ts
 */

async function whenStable() {
  await Promise.all(
    window.frameworkStabilizers.map((stabilizer) => new Promise(stabilizer)),
  );
}

/**
 * This function is meant to be executed in the browser. It checks whether the
 * Angular framework has bootstrapped yet.
 */
function isBootstrapped() {
  return !!window.frameworkStabilizers;
}

type FrameworkStabilizer = (callback: (value: void) => void) => void;

declare global {
  interface Window {
    /**
     * These hooks are exposed by Angular to register a callback for when the
     * application is stable (no more pending tasks).
     *
     * For the implementation, see:
     * https://github.com/angular/angular/blob/main/packages/platform-browser/src/browser/testability.ts#L30-L49
     */
    frameworkStabilizers: FrameworkStabilizer[];
  }
}
