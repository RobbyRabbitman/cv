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
  setAllEntities,
  upsertEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import type {
  Locale,
  LocaleId,
  Translations,
} from '@robby-rabbitman/cv-libs-i18n-types';
import { exhaustMap, from, pipe, switchMap } from 'rxjs';
import { I18nApi } from '../api/i18n-api';

interface I18nState {
  /** The current locale. */
  _localeId: LocaleId;
}

const TranslationEntity = entityConfig({
  entity: type<{
    localeId: LocaleId;
    value: Translations;
  }>(),
  collection: 'translation',
  selectId: (translation) => translation.localeId,
});

const LocaleEntity = entityConfig({
  entity: type<Locale>(),
  collection: 'locale',
  selectId: (locale) => locale.id,
});

export const I18n = signalStore(
  withState<I18nState>({ _localeId: 'en' }),
  withEntities(LocaleEntity),
  withEntities(TranslationEntity),
  withLinkedState(
    ({ _localeId, translationEntityMap, localeEntityMap, localeEntities }) => ({
      locale: () =>
        localeEntityMap()[_localeId()] ?? {
          id: 'en',
          text: 'English',
          translationId: 'en',
        },
      locales: () =>
        localeEntities().map((locale) => ({
          ...locale,
          active: locale.id === _localeId(),
        })),
      translations: () => translationEntityMap()[_localeId()]?.value,
    }),
  ),
  withMethods((store) => {
    const i18nApi = inject(I18nApi);

    const getTranslations = rxMethod<LocaleId>(
      pipe(
        /**
         * We use switchMap here, to cancel any ongoing requests, when a new
         * locale is set, since only the translations of the active locale are
         * relevant.
         */
        switchMap((localeId) => {
          return from(i18nApi.getTranslations(localeId)).pipe(
            tapResponse({
              next: (translations) =>
                patchState(
                  store,
                  upsertEntity(
                    {
                      localeId,
                      value: translations,
                    },
                    TranslationEntity,
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
              next: (locales) =>
                patchState(store, setAllEntities(locales, LocaleEntity)),
              error: () => {
                // TODO: handle no locales available
              },
            }),
          ),
        ),
      ),
    );

    return {
      setLocale: (locale: LocaleId) => {
        /**
         * Optimistic update
         *
         * TODO: how to indicate loading state?
         */
        patchState(store, { _localeId: locale });

        getTranslations(locale);
      },
      getTranslations,
      getLocales,
    };
  }),
  withHooks({
    onInit: (store) => {
      store.getLocales();
      store.getTranslations(store._localeId());
    },
  }),
);
