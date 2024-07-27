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
import { Api } from '@cv/data';
import { Translation } from '@cv/i18n/types';
import { injectDocumentLocale } from '@cv/i18n/util';
import { Block, BlockPrototype, Cv } from '@cv/types';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, forkJoin, from, map, pipe, switchMap, tap } from 'rxjs';

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

  protected api = inject(Api);

  /** Sets the locale of this store. */
  setLocale = rxMethod<string>(
    pipe(
      tap((locale) => {
        patchState(this, {
          locale,
        });
      }),
      filter((locale) => !this.translations()[locale]),
      tap((locale) => {
        patchState(this, setEntityStatus('translation', 'loading', locale));
      }),
      switchMap((locale) =>
        from(this.api.getAllCvTemplates()).pipe(
          map((cvTemplates) => cvTemplates.map((cvTemplate) => cvTemplate.id)),
          switchMap((cvTemplateIds) =>
            forkJoin(
              ['common', ...cvTemplateIds].map((id) =>
                from(this.api.getTranslation(id, locale)).pipe(
                  tapResponse({
                    next: (translation) => {
                      this.mergeTranslation(
                        locale,
                        translation,
                        id !== 'common' ? `CV.EDIT` : undefined,
                      );
                      patchState(
                        this,
                        setEntityStatus('translation', 'success', locale),
                      );
                    },
                    error: () => {
                      patchState(
                        this,
                        setEntityStatus('translation', 'error', locale),
                      );
                    },
                  }),
                ),
              ),
            ),
          ),
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
          prefix
            ? prefix
                .split('.')
                .reverse()
                .reduce(
                  (translation, path) => ({ [path]: translation }),
                  translation,
                )
            : translation,
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

  translateBlock(options: {
    cv: Cv;
    blockOrPrototype: Block | BlockPrototype;
    key: string;
    params?: Record<string, string>;
  }) {
    return this.translate(
      [this.translateBlockPrefix(options), options.key].join('.'),
      options.params,
    );
  }

  translateBlockPrefix(options: {
    cv: Cv;
    blockOrPrototype: Block | BlockPrototype;
  }) {
    return `CV.TEMPLATE.${options.cv.templateId}.${'prototypeId' in options.blockOrPrototype ? options.blockOrPrototype.prototypeId : options.blockOrPrototype.id}`.toUpperCase();
  }

  localized = computed(
    () => this.translationStatus(this.locale())() === 'success',
  );
}
