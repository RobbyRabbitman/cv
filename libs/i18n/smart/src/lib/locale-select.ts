import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nStore } from '@cv/i18n-data';
import { Translate } from './translate';

@Component({
  selector: 'cv-i18n--locale-select',
  standalone: true,
  imports: [Translate],
  template: `<label>
    <span class="sr-only">
      {{ 'I18N.LOCALE.SELECT.LABEL' | translate }}
    </span>
    <select (change)="i18n.setLocale($any($event.target).value)">
      @for (locale of i18n.locales(); track locale) {
        <!-- TODO display locale in locale (?) -->
        <option [selected]="locale === i18n.locale()" [value]="locale">
          {{ locale }}
        </option>
      }
    </select>
  </label>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocaleSelect {
  protected i18n = inject(I18nStore);
}
