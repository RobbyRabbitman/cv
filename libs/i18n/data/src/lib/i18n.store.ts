import { HttpClient } from '@angular/common/http';
import {
  EnvironmentProviders,
  Injectable,
  computed,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import {
  mergeObjects,
  objectPath,
  setEntityStatus,
  withEntityStatus,
} from '@cv/common/util';
import { Translation } from '@cv/i18n/types';
import { injectDocumentLocale } from '@cv/i18n/util';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { createInjectionToken } from 'ngxtension/create-injection-token';
import { filter, pipe, switchMap, tap } from 'rxjs';

export const [injectTranslationApi, provideTranslationApi] =
  createInjectionToken(() => {
    const http = inject(HttpClient);
    return (locale: string) =>
      http.get<Translation>(`assets/i18n/${locale}.json`);
  });

export function provideI18nStore(): EnvironmentProviders {
  return makeEnvironmentProviders([I18nStore]);
}

interface State {
  /** 2 letter format e.g. 'en'. */
  locale: string;

  /** Translations. */
  translations: Record<string, Translation>;

  /** The available locales. */
  locales: string[];
}

const State = signalStore(
  withState(() => {
    const initialState: State = {
      locale: injectDocumentLocale().slice(0, 2),
      locales: ['en', 'de'],
      translations: {},
    };
    return initialState;
  }),
  withEntityStatus('translation'),
);

@Injectable()
export class I18nStore extends State {
  constructor() {
    super();
    this.setLocale(this.locale());
  }

  protected translationLoader = injectTranslationApi();

  /** Sets the locale of this store. */
  setLocale = rxMethod<string>(
    pipe(
      filter((locale) => !this.translations()[locale]),
      tap((locale) => {
        patchState(
          this,
          {
            locale,
          },
          setEntityStatus('translation', 'loading', locale),
        );
      }),
      switchMap((locale) =>
        this.translationLoader(locale).pipe(
          tapResponse({
            next: (translation) => {
              patchState(
                this,
                {
                  translations: {
                    ...this.translations,
                    [locale]: translation,
                  },
                },
                setEntityStatus('translation', 'success', locale),
              );
            },
            error: () => {
              patchState(this, setEntityStatus('translation', 'error', locale));
            },
          }),
        ),
      ),
    ),
  );

  mergeTranslation = (
    locale: string,
    translation: Translation,
    prefix?: string,
  ) => {
    patchState(this, {
      translations: {
        ...this.translations(),
        [locale]: mergeObjects(
          this.translations()[locale],
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

  translateOnce(key: string, params?: Record<string, string>): string {
    const translation = this.translations()[this.locale()];

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
  }

  translate(key: string, params?: Record<string, string>) {
    return computed(() => this.translateOnce(key, params));
  }

  localized = computed(
    () => this.translationStatus(this.locale())() === 'success',
  );
}
