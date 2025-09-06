import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  type,
  withHooks,
  withLinkedState,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  entityConfig,
  upsertEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, from, pipe, switchMap } from 'rxjs';
import { I18nApi } from '../api/i18n-api';

interface I18nState {
  /** The current locale. */
  locale: Intl.UnicodeBCP47LocaleIdentifier;

  /** Available locales. */
  locales: Intl.UnicodeBCP47LocaleIdentifier[];
}

export interface TranslationEntity {
  /** The locale of the translations. */
  locale: I18nState['locale'];

  /** The actual translations. */
  value: Record<string, unknown>;
}

const translationEntity = entityConfig({
  entity: type<TranslationEntity>(),
  collection: 'translation',
  selectId: (translation) => translation.locale,
});

export const I18n = signalStore(
  withState<I18nState>({ locale: 'en', locales: ['en'] }),
  withEntities(translationEntity),
  withLinkedState(({ locale, translationEntityMap }) => ({
    translations: () => translationEntityMap()[locale()]?.value,
  })),
  withMethods((store) => {
    const i18nApi = inject(I18nApi);

    const getTranslations = rxMethod<Intl.UnicodeBCP47LocaleIdentifier>(
      pipe(
        /**
         * We use switchMap here, to cancel any ongoing requests, when a new
         * locale is set, since only the translations of the active locale are
         * relevant.
         */
        switchMap((locale) => {
          return from(i18nApi.getTranslations(locale)).pipe(
            tapResponse({
              next: (translations) =>
                patchState(
                  store,
                  upsertEntity(
                    {
                      locale,
                      value: translations,
                    },
                    translationEntity,
                  ),
                ),
              error: () => {
                /**
                 * TODO: what to do, when translations could not be loaded?
                 * Switch to the default langauge?
                 */
              },
            }),
          );
        }),
      ),
    );

    const getLocales = rxMethod<void>(
      pipe(
        exhaustMap(() =>
          from(i18nApi.getLocales()).pipe(
            tapResponse({
              next: (locales) => patchState(store, { locales }),
              error: () => {},
            }),
          ),
        ),
      ),
    );

    return {
      setLocale: (locale: Intl.UnicodeBCP47LocaleIdentifier) => {
        /**
         * Optimistic update
         *
         * TODO: how to indicate loading state?
         */
        patchState(store, { locale });

        getTranslations(locale);
      },
      getTranslations,
      getLocales,
    };
  }),
  withHooks({
    onInit: (store) => {
      store.getLocales();
      store.getTranslations(store.locale());
    },
  }),
);
