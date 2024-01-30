import { Pipe, PipeTransform, inject } from '@angular/core';
import { injectWindow } from '@cv/common/util';
import { I18nStore } from '@cv/i18n/data';
import { Timestamp } from 'firebase/firestore';
import { markForCheckOnLocalization } from './change-detection';

@Pipe({
  name: 'date',
  standalone: true,
  pure: false,
})
export class I18nDate implements PipeTransform {
  protected store = inject(I18nStore);

  protected Intl = injectWindow().Intl;

  /**
   *
   * @param value iso 8601 string | milliseconds since 1970 | Date | Firestore Timestamp
   * @returns a localized string representing the value.
   */
  transform(value: string | number | Date | Timestamp): string {
    // TODO finout why 'switch(true) => narrowing type' doesnt work

    if (typeof value === 'string') value = new Date(value);
    else if (value instanceof Timestamp) value = value.toDate();

    return this.Intl.DateTimeFormat(this.store.locale()).format(value);
  }

  constructor() {
    markForCheckOnLocalization();
  }
}
