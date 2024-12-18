import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import {
  MatMenuHarness,
  MatMenuItemHarness,
} from '@angular/material/menu/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommonStore } from '@robby-rabbitman/cv-libs-common-data';
import { provideCommonStoreStub } from '@robby-rabbitman/cv-libs-common-data/testing';
import type { ColorScheme } from '@robby-rabbitman/cv-libs-common-types';
import { SelectColorScheme } from './select-color-scheme';

describe('[Unit Test] SelectColorScheme', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideCommonStoreStub()],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SelectColorScheme);
    const component = fixture.componentInstance;

    expect(component).toBeInstanceOf(SelectColorScheme);
  });
});

describe('[Component Test] SelectColorScheme', () => {
  const findSelectedMenuItem = async (menu: MatMenuHarness) => {
    const selectedMenuItems: MatMenuItemHarness[] = [];

    for (const menuItem of await menu.getItems()) {
      const selected = await (
        await menuItem.host()
      ).hasClass(
        'cv-common--feature-color-scheme--select-color-scheme__option--selected',
      );

      if (selected) {
        selectedMenuItems.push(menuItem);
      }
    }

    if (selectedMenuItems.length !== 1) {
      throw new Error(
        `Expected exactly 1 selected menu item, but found ${selectedMenuItems.length}`,
      );
    }

    return selectedMenuItems[0]!;
  };

  const findDeselectedMenuItems = async (menu: MatMenuHarness) => {
    const deselectedMenuItems: MatMenuItemHarness[] = [];

    for (const menuItem of await menu.getItems()) {
      const selected = await (
        await menuItem.host()
      ).hasClass(
        'cv-common--feature-color-scheme--select-color-scheme__option--selected',
      );

      if (!selected) {
        deselectedMenuItems.push(menuItem);
      }
    }

    return deselectedMenuItems;
  };

  const findMenuItemByColorScheme = async (
    menu: MatMenuHarness,
    colorScheme: ColorScheme,
  ) => {
    for (const menuItem of await menu.getItems()) {
      if (
        colorScheme ===
        (await (await menuItem.host()).getAttribute('data-option'))
      ) {
        return menuItem;
      }
    }

    throw new Error(
      `Could not find menu item for color scheme: ${colorScheme}`,
    );
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideCommonStoreStub(), provideAnimationsAsync('noop')],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SelectColorScheme);
    const component = fixture.componentInstance;

    expect(component).toBeInstanceOf(SelectColorScheme);
  });

  describe('menu', () => {
    it('should select the color scheme when clicked', async () => {
      const fixture = TestBed.createComponent(SelectColorScheme);
      const loader = TestbedHarnessEnvironment.loader(fixture);
      const commonStore = TestBed.inject(CommonStore);

      const menu = await loader.getHarness(MatMenuHarness);

      expect(commonStore.colorScheme()).toEqual('system');

      await menu.open();
      await (await findMenuItemByColorScheme(menu, 'dark')).click();
      expect(commonStore.colorScheme()).toEqual('dark');

      await menu.open();
      await (await findMenuItemByColorScheme(menu, 'light')).click();
      expect(commonStore.colorScheme()).toEqual('light');

      await menu.open();
      await (await findMenuItemByColorScheme(menu, 'system')).click();
      expect(commonStore.colorScheme()).toEqual('system');
    });

    it('should close after a color scheme option is selected', async () => {
      const fixture = TestBed.createComponent(SelectColorScheme);
      const loader = TestbedHarnessEnvironment.loader(fixture);

      const menu = await loader.getHarness(MatMenuHarness);

      await menu.open();
      const menuItem = (await findDeselectedMenuItems(menu))[0]!;
      await menuItem.click();
      expect(await menu.isOpen()).toEqual(false);

      await menu.open();
      const selectedMenuItem = await findSelectedMenuItem(menu);
      await selectedMenuItem.click();
      expect(await menu.isOpen()).toEqual(false);
    });

    it('should display a radio button checked icon for the selected color scheme', async () => {
      const fixture = TestBed.createComponent(SelectColorScheme);
      const loader = TestbedHarnessEnvironment.loader(fixture);

      const menu = await loader.getHarness(MatMenuHarness);

      await menu.open();

      const selectedMenuItem = await findSelectedMenuItem(menu);

      const selectedMenuItemElement =
        TestbedHarnessEnvironment.getNativeElement(
          await selectedMenuItem.host(),
        );
      expect(
        selectedMenuItemElement
          .querySelector(
            '.cv-common--feature-color-scheme--select-color-scheme__option-selected-icon',
          )
          ?.textContent?.trim(),
      ).toEqual('radio_button_checked');
    });

    it('should display a radio button unchecked icon for the deselected color schemes', async () => {
      const fixture = TestBed.createComponent(SelectColorScheme);
      const loader = TestbedHarnessEnvironment.loader(fixture);

      const menu = await loader.getHarness(MatMenuHarness);

      await menu.open();

      const deselectedMenuItems = await findDeselectedMenuItems(menu);

      for (const deselectedMenuItem of deselectedMenuItems) {
        const deselectedMenuItemElement =
          TestbedHarnessEnvironment.getNativeElement(
            await deselectedMenuItem.host(),
          );

        expect(
          deselectedMenuItemElement
            .querySelector(
              '.cv-common--feature-color-scheme--select-color-scheme__option-selected-icon',
            )
            ?.textContent?.trim(),
        ).toEqual('radio_button_unchecked');
      }
    });
  });
});
