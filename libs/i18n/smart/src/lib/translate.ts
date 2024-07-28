import { Injector, Pipe, PipeTransform, inject } from '@angular/core';
import { I18nStore } from '@cv/i18n/data';
import { TranslationParameters } from '@cv/i18n/types';
import { assertInjector } from 'ngxtension/assert-injector';
import {
  createInjectionToken,
  createNoopInjectionToken,
} from 'ngxtension/create-injection-token';
import { markForCheckOnLocalization } from './change-detection';

export const [translatePrefix, provideTranslatePrefix] =
  createNoopInjectionToken<string>('translate prefix');

export const [translateFactory, provideTranslateFactory] = createInjectionToken(
  () => {
    const store = inject(I18nStore);

    const translateFactory = function (injector?: Injector) {
      injector = assertInjector(translateFactory, injector);

      const prefix = translatePrefix({
        self: true,
        optional: true,
        injector,
      });

      return prefix
        ? (key: string, params?: TranslationParameters) =>
            store.translateOnce(`${prefix}.${key}`, { params })
        : store.translateOnce;
    };

    return translateFactory;
  },
);

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class Translate implements PipeTransform {
  protected store = inject(I18nStore);

  protected prefix = translatePrefix({
    host: true,
    skipSelf: true,
    optional: true,
  });

  transform = this.prefix
    ? (key: string, params?: TranslationParameters) =>
        this.store.translateOnce(`${this.prefix}.${key}`, { params })
    : (key: string, params?: TranslationParameters) =>
        this.store.translateOnce(key, { params });

  constructor() {
    markForCheckOnLocalization();
  }
}
