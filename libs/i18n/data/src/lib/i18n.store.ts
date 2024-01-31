import { HttpClient } from '@angular/common/http';
import {
  EnvironmentProviders,
  computed,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { EntityStatus, patchEntityStatus } from '@cv/common/types';
import { mergeObjects, objectPath } from '@cv/common/util';
import { Translation } from '@cv/i18n/types';
import { injectDocumentLocale } from '@cv/i18n/util';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { createInjectionToken } from 'ngxtension/create-injection-token';
import { filter, pipe, switchMap, tap } from 'rxjs';

export const [injectTranslationLoader, provideTranslationLoader] =
  createInjectionToken(() => {
    const http = inject(HttpClient);
    return (locale: string) => http.get(`assets/i18n/${locale}.json`);
  });

export function provideI18nStore(): EnvironmentProviders {
  return makeEnvironmentProviders([I18nStore]);
}

interface Store {
  /** 2 letter format e.g. 'en'. */
  locale: string;

  /** Translations. */
  translations: Record<string, Translation>;

  /** Status of the translations. */
  translationStatus: Record<string, EntityStatus>;

  /** The available locales. */
  locales: string[];
}

export const I18nStore = signalStore(
  withState(() => {
    const initialState: Store = {
      locale: injectDocumentLocale().slice(0, 2),
      locales: ['en', 'de'],
      translations: {},
      translationStatus: {},
    };
    return initialState;
  }),
  withMethods((store) => {
    const translationLoader = injectTranslationLoader();

    const setLocale = rxMethod<string>(
      pipe(
        filter((locale) => !store.translations()[locale]),
        tap((locale) => {
          patchState(store, {
            locale,
            translationStatus: patchEntityStatus(
              store.translationStatus(),
              'loading',
              locale,
            ),
          });
        }),
        switchMap((locale) =>
          translationLoader(locale).pipe(
            tapResponse({
              next: (translation) => {
                patchState(store, {
                  translations: {
                    ...store.translations,
                    [locale]: translation,
                  },
                  translationStatus: patchEntityStatus(
                    store.translationStatus(),
                    'success',
                    locale,
                  ),
                });
              },
              error: () => {
                patchState(store, {
                  translationStatus: patchEntityStatus(
                    store.translationStatus(),
                    'error',
                    locale,
                  ),
                });
              },
            }),
          ),
        ),
      ),
    );

    const mergeTranslation = (
      locale: string,
      translation: Translation,
      prefix?: string,
    ) => {
      patchState(store, {
        translations: {
          ...store.translations(),
          [locale]: mergeObjects(
            store.translations()[locale],
            (prefix ?? '')
              .split('.')
              .reverse()
              .reduce(
                (translation, path) => ({ [path]: translation }),
                translation,
              ),
          ),
        },
      });
    };

    const translateOnce = function (
      key: string,
      params?: Record<string, string>,
    ): string {
      const translation = store.translations()[store.locale()];

      if (!translation) return key;

      try {
        const value = objectPath<string | Translation>(translation, key);

        if (typeof value !== 'string') throw new Error(``);

        if (params)
          return Object.keys(params).reduce(
            (value, param) => value.replaceAll(`{{ ${param} }}`, params[param]),
            value,
          );

        return value;
      } catch {
        return key;
      }
    };

    const translate = function (key: string, params?: Record<string, string>) {
      return computed(() => translateOnce(key, params));
    };

    const localized = computed(
      () => store.translationStatus()[store.locale()] === 'success',
    );

    return { translateOnce, translate, setLocale, mergeTranslation, localized };
  }),
  withHooks({
    onInit(store) {
      store.setLocale(store.locale());
    },
  }),
);
