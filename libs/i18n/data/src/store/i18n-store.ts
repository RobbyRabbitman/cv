import { effect, inject, untracked } from '@angular/core';
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
  entity: type<Translations>(),
  collection: 'translation',
  selectId: (translation) => translation.id,
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
    ({
      _localeId: localeId,
      translationEntities,
      localeEntityMap,
      localeEntities,
    }) => ({
      /** The current locale. */
      locale: () =>
        localeEntityMap()[localeId()] ?? {
          id: 'en',
          text: 'English',
          translationId: 'en',
        },
      /** All available locales. */
      locales: () =>
        localeEntities().map((locale) => ({
          ...locale,
          active: locale.id === localeId(),
        })),
      /** The translations for the current locale. */
      translations: () =>
        translationEntities().find(
          (translations) => translations.localeId === localeId(),
        ),
    }),
  ),
  withMethods((store) => {
    const i18nApi = inject(I18nApi);

    /** Gets the translations for a certain locale. */
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
                  /**
                   * We upsert here, because we lazily load translations for
                   * different cv prototypes.
                   */
                  upsertEntity(translations, TranslationEntity),
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

    /** Gets all available locales. */
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

    /** Sets the current locale, and loads its translations. */
    const setLocale = (locale: LocaleId) => {
      /**
       * Optimistic update
       *
       * TODO: how to indicate loading state?
       */
      patchState(store, { _localeId: locale });
    };

    return {
      setLocale,
      getTranslations,
      getLocales,
    };
  }),
  withHooks({
    onInit: (store) => {
      /**
       * Initially get all available locales and the translations for the active
       * locale.
       */
      store.getLocales();

      /** Whenever the locale changes, get its translations. */
      effect(() => {
        const locale = store.locale();

        untracked(() => {
          store.getTranslations(locale.id);
        });
      });
    },
  }),
);
