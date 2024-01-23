import {
  ChangeDetectorRef,
  Pipe,
  PipeTransform,
  effect,
  inject,
} from '@angular/core';
import { I18nStore } from '@cv/i18n/data';
import { createInjectionToken } from 'ngxtension/create-injection-token';

export const [injectTranslatePrefix, provideTranslatePrefix] =
  createInjectionToken(() => '');

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class Translate implements PipeTransform {
  protected store = inject(I18nStore);

  protected cdr = inject(ChangeDetectorRef);

  protected prefix = injectTranslatePrefix({
    host: true,
    skipSelf: true,
    optional: true,
  });

  transform = this.prefix
    ? (key: string, params?: Record<string, string | number>) =>
        this.store.translateInstant(`${this.prefix}.${key}`, params)
    : this.store.translateInstant;

  constructor() {
    effect(() => {
      if (!this.store.loading()) {
        this.cdr.markForCheck();
      }
    });
  }
}
