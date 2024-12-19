import { parallel } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommonStore } from '@robby-rabbitman/cv-libs-common-data';
import { provideCommonStoreStub } from '@robby-rabbitman/cv-libs-common-data/testing';
import { SelectColorScheme } from '@robby-rabbitman/cv-libs-common-feature--color-scheme';
import type { ColorScheme } from '@robby-rabbitman/cv-libs-common-types';
import { SelectColorSchemeHarness } from './select-color-scheme.harness';

describe('[Integration Test] SelectColorSchemeHarness', () => {
  @Component({
    template: `<cv-common--feature-color-scheme--select-color-scheme />`,
    imports: [SelectColorScheme],
  })
  class SelectColorSchemeTest {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideCommonStoreStub(), provideAnimationsAsync('noop')],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SelectColorSchemeTest);
    const component = fixture.componentInstance;
    expect(component).toBeInstanceOf(SelectColorSchemeTest);
  });

  describe('getMenuItemByColorScheme', () => {
    it('should return the menu item by color scheme', async () => {
      const fixture = TestBed.createComponent(SelectColorSchemeTest);
      const loader = TestbedHarnessEnvironment.loader(fixture);
      const store = TestBed.inject(CommonStore);

      const [selectColorScheme, menu] = await parallel(() => [
        loader.getHarness(SelectColorSchemeHarness),
        loader.getHarness(MatMenuHarness),
      ]);

      await menu.open();

      for (const colorScheme of store.colorSchemes()) {
        const menuItem =
          await selectColorScheme.getMenuItemByColorScheme(colorScheme);
        const menuItemHost = await menuItem.host();
        await expectAsync(
          menuItemHost.getAttribute('data-option'),
        ).toBeResolvedTo(colorScheme);
      }
    });

    it('should return null if the menu item does not exist', async () => {
      const fixture = TestBed.createComponent(SelectColorSchemeTest);
      const loader = TestbedHarnessEnvironment.loader(fixture);

      const [selectColorScheme, menu] = await parallel(() => [
        loader.getHarness(SelectColorSchemeHarness),
        loader.getHarness(MatMenuHarness),
      ]);

      await menu.open();

      await expectAsync(
        selectColorScheme.getMenuItemByColorScheme('foo' as ColorScheme),
      ).toBeRejected();
    });
  });

  describe('getSelectedMenuItem', () => {
    it('should return the selected menu item', async () => {
      const fixture = TestBed.createComponent(SelectColorSchemeTest);
      const loader = TestbedHarnessEnvironment.loader(fixture);

      const [selectColorScheme, menu] = await parallel(() => [
        loader.getHarness(SelectColorSchemeHarness),
        loader.getHarness(MatMenuHarness),
      ]);

      await menu.open();

      const selectedMenuItem = await selectColorScheme.getSelectedMenuItem();
      const selectedMenuItemHost = await selectedMenuItem.host();

      await expectAsync(
        selectedMenuItemHost.hasClass(
          'cv-common--feature-color-scheme--select-color-scheme__option--selected',
        ),
      ).toBeResolvedTo(true);
    });
  });

  describe('getDeselectedMenuItems', () => {
    it('should return the deselected menu items', async () => {
      const fixture = TestBed.createComponent(SelectColorSchemeTest);
      const loader = TestbedHarnessEnvironment.loader(fixture);

      const [selectColorScheme, menu] = await parallel(() => [
        loader.getHarness(SelectColorSchemeHarness),
        loader.getHarness(MatMenuHarness),
      ]);

      await menu.open();

      const deselectedMenuItems =
        await selectColorScheme.getDeselectedMenuItems();

      for (const menuItem of deselectedMenuItems) {
        const menuItemHost = await menuItem.host();
        await expectAsync(
          menuItemHost.hasClass(
            'cv-common--feature-color-scheme--select-color-scheme__option--selected',
          ),
        ).toBeResolvedTo(false);
      }
    });
  });
});
