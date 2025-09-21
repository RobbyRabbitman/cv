import {
  ChangeDetectorRef,
  inject,
  Pipe,
  type PipeTransform,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { I18n } from '@robby-rabbitman/cv-libs-i18n-data';
import { map } from 'rxjs';

@Pipe({ name: 'date', pure: false })
export class DatePipe implements PipeTransform {
  protected readonly i18n = inject(I18n);
  protected readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    this.transformOnLocaleChange.subscribe();
  }

  /** Re-evaluate the pipe when the locale changes */
  private readonly transformOnLocaleChange = toObservable(
    this.i18n.locale,
  ).pipe(
    takeUntilDestroyed(),
    map(() => this.cdr.markForCheck()),
  );

  transform(
    value: string | number | Date,
    options?: Intl.DateTimeFormatOptions,
  ) {
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${value}`);
    }

    return Intl.DateTimeFormat(this.i18n.locale().id, options).format(date);
  }
}
