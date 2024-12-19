import { ComponentHarness } from '@angular/cdk/testing';
import { reflectComponentType } from '@angular/core';
import {
  MatMenuHarness,
  MatMenuItemHarness,
} from '@angular/material/menu/testing';
import { SelectColorScheme } from '@robby-rabbitman/cv-libs-common-feature--color-scheme';
import type { ColorScheme } from '@robby-rabbitman/cv-libs-common-types';

export class SelectColorSchemeHarness extends ComponentHarness {
  static hostSelector = reflectComponentType(SelectColorScheme)
    ?.selector as string;

  getMenu() {
    return this.locatorFor(MatMenuHarness)();
  }

  async getSelectedMenuItem() {
    const menuItems = await (await this.getMenu()).getItems();
    const selectedMenuItems: MatMenuItemHarness[] = [];

    for (const menuItem of menuItems) {
      const selected = await (
        await menuItem.host()
      ).hasClass(
        'cv-common--feature-color-scheme--select-color-scheme__option--selected',
      );

      if (selected) {
        selectedMenuItems.push(menuItem);
      }
    }

    return selectedMenuItems[0] as MatMenuItemHarness;
  }

  async getDeselectedMenuItems() {
    const menuItems = await (await this.getMenu()).getItems();
    const deselectedMenuItems: MatMenuItemHarness[] = [];

    for (const menuItem of menuItems) {
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
  }

  async getMenuItemByColorScheme(colorScheme: ColorScheme) {
    const menuItems = await (await this.getMenu()).getItems();

    for (const menuItem of menuItems) {
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
  }
}
