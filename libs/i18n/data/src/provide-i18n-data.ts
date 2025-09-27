import { inject, type Provider } from '@angular/core';
import { provideTranslation } from '@robby-rabbitman/cv-libs-i18n-translation';
import { I18nApi } from './api/i18n-api';
import { I18n } from './store/i18n-store';

export function provideI18nData() {
  return [
    I18n,
    I18nApi,
    provideTranslation({
      i18n: () => inject(I18n),
    }),
  ] satisfies Provider[];
}
