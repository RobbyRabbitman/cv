import {
  effect,
  inject,
  InjectionToken,
  type Signal,
  untracked,
} from '@angular/core';
import { TranslateService, type TranslationObject } from '@ngx-translate/core';
import type { Locale, Translations } from '@robby-rabbitman/cv-libs-i18n-types';

export interface I18nToNgxTranslate {
  locale: Signal<Locale>;
  translations: Signal<Translations | undefined>;
}

export const I18N_TO_NGX_TRANSLATE = new InjectionToken<I18nToNgxTranslate>(
  'I18N_TO_NGX_TRANSLATE_DATA',
);

export function i18nToNgxTranslate() {
  const ngxTranslations = inject(TranslateService);
  const i18n = inject(I18N_TO_NGX_TRANSLATE);

  effect(() => {
    const locale = new Intl.Locale(i18n.locale().id);
    const translations = i18n.translations();

    untracked(() => {
      if (translations) {
        ngxTranslations.use(locale.language);
        ngxTranslations.setTranslation(
          locale.language,
          translations.value as TranslationObject,
        );
      }
    });
  });
}
