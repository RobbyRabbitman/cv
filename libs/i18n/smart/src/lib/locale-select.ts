import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { I18nStore } from '@cv/i18n/data';
import { Translate, provideTranslatePrefix } from './translate';

@Component({
  selector: 'cv-i18n-smart--locale-select',
  standalone: true,
  imports: [Translate],
  viewProviders: [provideTranslatePrefix('I18N.LOCALE.SELECT')],
  template: `<label class="select-label">
    <span class="sr-only">
      {{ 'LABEL' | translate }}
    </span>
    <span aria-hidden="true" class="select-icon"> translate </span>
    <span aria-hidden="true" class="select-arrow-icon"> arrow_drop_down </span>
    <select
      class="select-with-icon"
      (change)="i18n.setLocale($any($event.target).value)"
    >
      @for (locale of i18n.locales(); track locale) {
        <!-- TODO display locale in locale (?) -->
        <option [selected]="locale === i18n.locale()" [value]="locale">
          {{ locale }}
        </option>
      }
    </select>
  </label>`,
  styleUrl: './locale-select.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocaleSelect {
  protected i18n = inject(I18nStore);
}
