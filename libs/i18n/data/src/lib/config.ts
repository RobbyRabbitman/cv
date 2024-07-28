import {
  effect,
  ENVIRONMENT_INITIALIZER,
  inject,
  makeEnvironmentProviders,
  Provider,
  untracked,
} from '@angular/core';
import { coerceLocale } from '@cv/i18n/util';
import { I18nStore, provideI18nStore } from './i18n.store';

export function provideI18nData(...features: I18nDataFeature[]) {
  return makeEnvironmentProviders([
    provideI18nStore(),
    ...features.map((feature) => feature.providers),
  ]);
}

/**
 *  Whenever the locales or locale changes, the locale is coerced to one of the supported locales.
 */
export function withCoerceLocale(options: {
  weights: Partial<Record<keyof Intl.LocaleOptions, number>>;
}) {
  return makeI18nDataFeature('coerce-locale', [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory: () => {
        const i18n = inject(I18nStore);

        return () =>
          effect(() => {
            const locale = i18n.locale();
            const locales = i18n.locales();

            const coercedLocale = coerceLocale(locale, locales, {
              weights: options.weights,
            });

            untracked(() => i18n.setLocale(coercedLocale ?? locale));
          });
      },
    },
  ]);
}

type I18nDataFeatureKind = 'coerce-locale';

interface I18nDataFeature {
  kind: I18nDataFeatureKind;
  providers: Provider[];
}

function makeI18nDataFeature(kind: I18nDataFeatureKind, providers: Provider[]) {
  return { kind, providers } satisfies I18nDataFeature;
}
