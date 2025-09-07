import { effect, inject, untracked } from '@angular/core';
import { TranslateService, type TranslationObject } from '@ngx-translate/core';
import { I18n } from '@robby-rabbitman/cv-libs-i18n-data';

export function i18nToNgxTranslate() {
  const ngxTranslations = inject(TranslateService);
  const i18n = inject(I18n);

  /** Reflect locale changes and set translations. */
  effect(() => {
    const locale = new Intl.Locale(i18n.locale().id);
    const translations = i18n.translations();

    untracked(() => {
      if (translations) {
        ngxTranslations.use(locale.language);
        ngxTranslations.setTranslation(
          locale.language,
          translations as TranslationObject,
        );
      }
    });
  });
}
