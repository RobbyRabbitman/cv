import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatMenu,
  MatMenuContent,
  MatMenuItem,
  MatMenuTrigger,
} from '@angular/material/menu';
import { deepComputed } from '@ngrx/signals';
import { CommonStore } from '@robby-rabbitman/cv-libs-common-data';
import type { ColorScheme } from '@robby-rabbitman/cv-libs-common-types';

type SelectColorSchemeIcons = Record<ColorScheme, string>;

interface SelectColorSchemeOption {
  value: ColorScheme;
  selected: boolean;
  selectedIcon: string;
  valueIcon: string;
}

const SELECT_COLOR_SCHEME_ICONS = {
  light: 'light_mode',
  dark: 'dark_mode',
  system: 'monitor',
} as const satisfies SelectColorSchemeIcons;

@Component({
  selector: 'cv-common--feature-color-scheme--select-color-scheme',
  standalone: true,
  imports: [
    MatMenu,
    MatIconButton,
    MatMenuContent,
    MatMenuItem,
    MatMenuTrigger,
    MatIcon,
  ],
  template: `
    <button mat-icon-button [mat-menu-trigger-for]="colorSchemeMenu">
      <mat-icon>{{ vm.menuTrigger.icon() }}</mat-icon>
      <!-- TODO: translate label -->
      <span class="sr-only">label</span>
    </button>
    <mat-menu #colorSchemeMenu>
      <ng-template matMenuContent>
        @for (
          colorSchemeOption of vm.colorSchemeOptions();
          track colorSchemeOption.value
        ) {
          <button
            mat-menu-item
            [class.cv-common--feature-color-scheme--select-color-scheme__option--selected]="
              colorSchemeOption.selected
            "
            [attr.data-option]="colorSchemeOption.value"
            (click)="common.setColorScheme(colorSchemeOption.value)"
          >
            <mat-icon
              class="cv-common--feature-color-scheme--select-color-scheme__option-selected-icon"
            >
              {{ colorSchemeOption.selectedIcon }}
            </mat-icon>
            <mat-icon
              class="cv-common--feature-color-scheme--select-color-scheme__option-value-icon order-2 !mr-0 ml-3"
            >
              {{ colorSchemeOption.valueIcon }}
            </mat-icon>
            <!-- TODO: translate value -->
            {{ colorSchemeOption.value }}
          </button>
        }
      </ng-template>
    </mat-menu>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectColorScheme {
  protected readonly common = inject(CommonStore);

  protected readonly vm = deepComputed(() => ({
    colorSchemeOptions: this.common.colorSchemes().map((colorScheme) => {
      const selected = colorScheme === this.common.colorScheme();

      return {
        value: colorScheme,
        selected,
        selectedIcon: selected
          ? 'radio_button_checked'
          : 'radio_button_unchecked',
        valueIcon: SELECT_COLOR_SCHEME_ICONS[colorScheme],
      } satisfies SelectColorSchemeOption;
    }),
    menuTrigger: {
      icon: 'format_color_fill',
    },
  }));
}
