import {
  EnvironmentProviders,
  Signal,
  computed,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Translation } from '@cv/i18n/types';
import { injectDocumentLocale } from '@cv/i18n/util';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { delay, firstValueFrom, map, merge, pipe, switchMap, tap } from 'rxjs';

export function provideI18nStore(): EnvironmentProviders {
  return makeEnvironmentProviders([I18nStore]);
}

interface Store {
  /** 2 letter format e.g. 'en'. */
  locale: string;

  /** Whether the app gets localized. */
  loading: boolean;

  /** The available locales. */
  locales: string[];
}

export const I18nStore = signalStore(
  withState(() => {
    const initialState: Store = {
      locale: injectDocumentLocale().slice(0, 2),
      loading: true,
      locales: ['en', 'de'], // TODO fetch from firestore?
    };
    return initialState;
  }),
  withMethods((store) => {
    const translateService = inject(TranslateService);

    const setLocale = rxMethod<string>(
      pipe(
        tap((locale) => {
          patchState(store, { locale, loading: true });
        }),
        delay(0), // trigger change detection so that the loading state can actually be read.
        switchMap((locale) => translateService.use(locale)),
        tap(() => {
          patchState(store, { loading: false });
        }),
      ),
    );

    const mergeTranslation = async (
      locale: string,
      translation: Translation,
      prefix?: string,
    ) => {
      await firstValueFrom(translateService.getTranslation(locale));
      translateService.setTranslation(
        locale,
        (prefix ?? '')
          .split('.')
          .reverse()
          .reduce(
            (translation, path) => ({ [path]: translation }),
            translation,
          ),
        true,
      );
    };

    toSignal(
      merge(
        translateService.onTranslationChange,
        translateService.onLangChange,
      ),
    );

    const localized = toSignal(
      merge(
        translateService.onTranslationChange,
        translateService.onLangChange,
      ).pipe(map(() => ({}))),
    );

    const translateInstant: (
      key: string,
      params?: Record<string, string | number>,
    ) => string = (key, params) => translateService.instant(key, params);

    const translate = function (
      key: string,
      params?: Record<string, string | number>,
    ): Signal<string> {
      return computed(() => {
        localized();
        return translateInstant(key, params);
      });
    };

    return {
      translateInstant,
      translate,
      setLocale,
      localized,
      mergeTranslation,
    };
  }),
  withHooks({
    onInit(store) {
      store.setLocale(store.locale());
    },
  }),
);
