import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { CommonStore } from '@cv/common/data';
import { Theme } from '@cv/common/types';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';

@Component({
  selector: 'cv-common-smart--theme-select',
  standalone: true,
  imports: [Translate, UpperCasePipe],
  viewProviders: [provideTranslatePrefix('COMMON.THEME.SELECT')],
  template: `<label class="select-label">
    <span class="sr-only">
      {{ 'LABEL' | translate }}
    </span>
    <span aria-hidden="true" class="select-icon">{{ icon() }}</span>
    <span aria-hidden="true" class="select-arrow-icon">arrow_drop_down</span>
    <select
      class="select-with-icon"
      (change)="common.setTheme($any($event.target).value)"
    >
      @for (theme of common.themes(); track theme) {
        <option [selected]="theme === common.theme()" [value]="theme">
          {{ 'OPTIONS.' + theme | uppercase | translate }}
        </option>
      }
    </select>
  </label>`,
  styleUrl: './theme-select.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelect {
  protected static icons = {
    dark: 'dark_mode',
    light: 'light_mode',
    system: 'monitor',
  } satisfies Record<Theme, string>;

  protected common = inject(CommonStore);

  protected icon = computed(() => ThemeSelect.icons[this.common.theme()]);
}
