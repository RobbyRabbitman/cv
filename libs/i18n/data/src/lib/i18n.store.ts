import {
  EnvironmentProviders,
  Injectable,
  computed,
  inject,
  makeEnvironmentProviders,
  untracked,
} from '@angular/core';
import { setEntityStatus, withEntityStatus } from '@cv/common/util';
import { Api } from '@cv/data';
import {
  Locale,
  Translation,
  TranslationParameters,
  TranslationValueType,
} from '@cv/i18n/types';
import {
  injectDocumentLocale,
  mergeTranslation,
  translate,
} from '@cv/i18n/util';
import { Block, BlockPrototype, Cv } from '@cv/types';
import { patchState, signalStore, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

export function provideI18nStore(): EnvironmentProviders {
  return makeEnvironmentProviders([I18nStore]);
}

interface State {
  locale: Locale;

  /** `AppLocale` => `Translation`. */
  translations: Record<Locale, Translation>;

  locales: Locale[];
}

const State = signalStore(
  withState(() => {
    const initialState: State = {
      locale: injectDocumentLocale(),
      locales: [],
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

  protected readonly api = inject(Api);

  /**
   * Sets the locale of this store. It will load common translations and translations for all CV templates.
   */
  readonly setLocale = rxMethod<string>(
    pipe(
      switchMap(async (locale: Locale) => {
        patchState(this, { locale });

        const translation = this.translations()[locale];

        if (translation) {
          return;
        }

        try {
          patchState(this, setEntityStatus('translation', 'loading', locale));

          const cvTemplates = await this.api.getAllCvTemplates();

          const cvTemplateIds = cvTemplates.map((cvTemplate) => cvTemplate.id);

          const cvTemplateTranslations = await Promise.all(
            cvTemplateIds.map(async (id) => {
              const translation = await this.api.getTranslation(id, locale);

              return {
                id,
                translation,
              };
            }),
          );

          for (const { id, translation } of cvTemplateTranslations) {
            this.mergeTranslation(
              locale,
              translation,
              `CV.TEMPLATE.${id.toUpperCase()}`,
            );
          }

          const commonTranslation = await this.api.getTranslation(
            'common',
            locale,
          );

          this.mergeTranslation(locale, commonTranslation);

          patchState(this, setEntityStatus('translation', 'success', locale));
        } catch (error) {
          patchState(this, setEntityStatus('translation', 'error', locale));
        }
      }),
    ),
  );

  protected readonly mergeTranslation = (
    locale: string,
    translation: Translation,
    prefix?: string,
  ) => {
    patchState(this, {
      translations: {
        ...this.translations(),
        [locale]: mergeTranslation(this.translations()[locale], translation, {
          prefix,
        }),
      },
    });
  };

  /**
   * For the current locale, returns the value of the provided key.
   */
  translateOnce<TResult extends TranslationValueType = 'string'>(
    key: string,
    options?: {
      params?: TranslationParameters;
      assert?: TResult;
    },
  ) {
    const translation = this.translations()[this.locale()];

    return translate(key, translation, {
      ...options,
    }) as TResult;
  }

  translate<TResult extends TranslationValueType = 'string'>(
    key: string,
    options?: {
      params?: TranslationParameters;
      assert?: TResult;
    },
  ) {
    return computed(() => this.translateOnce<TResult>(key, options));
  }

  translateBlock<TResult extends TranslationValueType = 'string'>(args: {
    key: string;
    cv: Cv;
    blockOrPrototype: Block | BlockPrototype;
    options?: {
      params?: TranslationParameters;
      assert?: TResult;
    };
  }) {
    return this.translate(
      [this.translateBlockPrefix(args), args.key].join('.'),
      args.options,
    );
  }

  translateBlockPrefix(options: {
    cv: Cv;
    blockOrPrototype: Block | BlockPrototype;
  }) {
    return `CV.TEMPLATE.${options.cv.templateId}.${'prototypeId' in options.blockOrPrototype ? options.blockOrPrototype.prototypeId : options.blockOrPrototype.id}`.toUpperCase();
  }

  readonly localized = computed(() => {
    const locales = this.locales();
    const locale = this.locale();
    const localeStatus = untracked(() => this.translationStatus(locale))();

    return localeStatus === 'success' && locales.includes(locale);
  });

  readonly Locale = computed(() => new Intl.Locale(this.locale()));

  readonly loadAllLocales = rxMethod<void>(
    pipe(
      switchMap(async () => {
        try {
          const locales = await this.api.getAllLocales();
          patchState(this, { locales });
        } finally {
          // TODO
        }
      }),
    ),
  );
}
