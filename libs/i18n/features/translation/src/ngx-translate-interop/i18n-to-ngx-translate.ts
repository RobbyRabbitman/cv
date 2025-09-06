import { effect, inject, untracked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18n } from '@robby-rabbitman/cv-libs-i18n-data';

export function i18nToNgxTranslate() {
  const ngxTranslations = inject(TranslateService);
  const i18n = inject(I18n);

  /** Reflect locale changes */
  effect(() => {
    const locale = new Intl.Locale(i18n.locale());

    untracked(() => {
      ngxTranslations.use(locale.language);
    });
  });
}
