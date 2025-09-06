import {
  TestKey,
  type EventData,
  type ModifierKeys,
  type TestElement,
  type TextOptions,
} from '@angular/cdk/testing';
import { type Locator } from 'playwright';

export class PlaywrightTestElement implements TestElement {
  protected static readonly CDK_MODIFIER_TO_WEB = {
    shift: 'Shift',
    control: 'Control',
    alt: 'Alt',
    meta: 'Meta',
  } as const;

  protected static readonly CDK_TEST_KEY_TO_WEB = {
    [TestKey.BACKSPACE]: 'Backspace',
    [TestKey.TAB]: 'Tab',
    [TestKey.ENTER]: 'Enter',
    [TestKey.SHIFT]: 'Shift',
    [TestKey.CONTROL]: 'Control',
    [TestKey.ALT]: 'Alt',
    [TestKey.ESCAPE]: 'Escape',
    [TestKey.PAGE_UP]: 'PageUp',
    [TestKey.PAGE_DOWN]: 'PageDown',
    [TestKey.END]: 'End',
    [TestKey.HOME]: 'Home',
    [TestKey.LEFT_ARROW]: 'ArrowLeft',
    [TestKey.UP_ARROW]: 'ArrowUp',
    [TestKey.RIGHT_ARROW]: 'ArrowRight',
    [TestKey.DOWN_ARROW]: 'ArrowDown',
    [TestKey.INSERT]: 'Insert',
    [TestKey.DELETE]: 'Delete',
    [TestKey.F1]: 'F1',
    [TestKey.F2]: 'F2',
    [TestKey.F3]: 'F3',
    [TestKey.F4]: 'F4',
    [TestKey.F5]: 'F5',
    [TestKey.F6]: 'F6',
    [TestKey.F7]: 'F7',
    [TestKey.F8]: 'F8',
    [TestKey.F9]: 'F9',
    [TestKey.F10]: 'F10',
    [TestKey.F11]: 'F11',
    [TestKey.F12]: 'F12',
    [TestKey.META]: 'Meta',
    [TestKey.COMMA]: ',',
  } satisfies Record<TestKey, string>;

  constructor(
    readonly locator: () => Locator,
    private whenStable: () => Promise<void>,
  ) {}

  async blur() {
    await this.locator().blur();
    await this.whenStable();
  }

  async clear() {
    await this.locator().clear();
    await this.whenStable();
  }

  click(modifiers?: ModifierKeys): Promise<void>;
  click(location: 'center', modifiers?: ModifierKeys): Promise<void>;
  click(x: number, y: number, modifiers?: ModifierKeys): Promise<void>;
  async click(
    ...args:
      | [ModifierKeys?]
      | ['center', ModifierKeys?]
      | [number, number, ModifierKeys?]
  ) {
    let modifiers: (typeof PlaywrightTestElement.CDK_MODIFIER_TO_WEB)[keyof typeof PlaywrightTestElement.CDK_MODIFIER_TO_WEB][] =
      [];

    /** The last argument are the optional modifier keys. */
    if (args.length && typeof args[args.length - 1] === 'object') {
      modifiers = this.toModifiers(args.pop() as ModifierKeys);
    }

    let position: { x: number; y: number } | undefined;

    if (args.length === 1 && args[0] === 'center') {
      const dimensions = await this.getDimensions();
      position = { x: dimensions.width / 2, y: dimensions.height / 2 };
    } else if (
      args.length === 2 &&
      typeof args[0] === 'number' &&
      typeof args[1] === 'number'
    ) {
      position = { x: args[0], y: args[1] };
    }

    await this.locator().click({
      button: 'left',
      position,
      modifiers,
    });
    await this.whenStable();
  }

  async rightClick(x: number, y: number, modifiers?: ModifierKeys) {
    this.locator().click({
      button: 'right',
      position: { x, y },
      modifiers: this.toModifiers(modifiers),
    });
    await this.whenStable();
  }

  async focus() {
    await this.locator().focus();
    await this.whenStable();
  }

  async getCssValue(property: string) {
    await this.whenStable();
    return this.locator().evaluate(
      (element, property) =>
        getComputedStyle(element).getPropertyValue(property),
      property,
    );
  }

  async hover() {
    await this.locator().hover();
    await this.whenStable();
  }

  async mouseAway() {
    await this.locator().page().mouse.move(-1, -1);
    await this.whenStable();
  }

  async sendKeys(...keys: (string | TestKey)[]): Promise<void>;
  async sendKeys(
    modifiers: ModifierKeys,
    ...keys: (string | TestKey)[]
  ): Promise<void>;
  async sendKeys(...keys: (string | TestKey | ModifierKeys)[]) {
    for (let key of keys) {
      if (this.isModiferKey(key)) {
        key = this.toModifiers(key).join('+');
      }

      if (this.isTestKey(key)) {
        key = PlaywrightTestElement.CDK_TEST_KEY_TO_WEB[key];
      }

      this.locator().press(key);
    }
  }

  private isModiferKey(
    key?: string | TestKey | ModifierKeys,
  ): key is ModifierKeys {
    return key != null && typeof key === 'object';
  }

  private isTestKey(key: string | TestKey | ModifierKeys): key is TestKey {
    return typeof key === 'string' && key in TestKey;
  }

  async text(options?: TextOptions) {
    await this.whenStable();

    if (options?.exclude) {
      throw new Error('The `exclude` option is not supported.');
    }

    return (await this.locator().textContent()) ?? '';
  }

  async setContenteditableValue(value: string) {
    await this.locator().fill(value);
    await this.whenStable();
  }

  async getAttribute(name: string) {
    await this.whenStable();
    return this.locator().getAttribute(name);
  }

  async hasClass(name: string) {
    await this.whenStable();
    return this.locator().evaluate(
      (element, name) => element.classList.contains(name),
      name,
    );
  }

  async getDimensions() {
    await this.whenStable();
    const box = await this.locator().boundingBox();

    if (!box) {
      throw new Error('Element is not visible.');
    }

    return {
      width: box.width,
      height: box.height,
      top: box.y,
      left: box.x,
    };
  }

  async getProperty<T>(name: string): Promise<T> {
    await this.whenStable();
    return this.locator().evaluate(
      (element, name) =>
        (
          element as unknown as {
            [name]: T;
          }
        )[name] as T,
      name,
    );
  }

  async matchesSelector(selector: string) {
    await this.whenStable();
    return this.locator().evaluate(
      (element, selector) => element.matches(selector),
      selector,
    );
  }

  async isFocused() {
    await this.whenStable();
    return this.matchesSelector(':focus');
  }

  async setInputValue(value: string) {
    await this.locator().fill(value);
    await this.whenStable();
  }

  async selectOptions(...optionIndexes: number[]) {
    await this.whenStable();

    const options = this.locator().locator('option');

    if (optionIndexes.length === 0 || (await options.count()) === 0) {
      return;
    }

    await this.setInputValue('');

    for (const index of new Set(optionIndexes)) {
      const option = options.nth(index);

      if (!(await option.count())) {
        throw new Error(`Option with index ${index} does not exist.`);
      }

      /** Support multiple selection by holding the Control key while clicking */
      await this.locator().page().keyboard.press('Control');

      await option.click();

      await this.locator().page().keyboard.up('Control');
    }

    await this.whenStable();
  }

  async dispatchEvent(name: string, data?: Record<string, EventData>) {
    await this.locator().dispatchEvent(name, data);
    await this.whenStable();
  }

  private toModifiers(modifiers?: ModifierKeys) {
    return Object.entries(modifiers ?? {})
      .filter(([, pressed]) => pressed)
      .map(
        ([key]) =>
          PlaywrightTestElement.CDK_MODIFIER_TO_WEB[key as keyof ModifierKeys],
      );
  }
}
