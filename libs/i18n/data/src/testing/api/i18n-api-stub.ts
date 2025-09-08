import { Injectable } from '@angular/core';
import type { I18nApi } from '@robby-rabbitman/cv-libs-i18n-data';
import type { Locale, LocaleId } from '@robby-rabbitman/cv-libs-i18n-types';

const LOCALES = [
  {
    id: 'en',
    translationId: 'en',
    name: 'English',
  },
  {
    id: 'de',
    translationId: 'de',
    name: 'Deutsch',
  },
] as const satisfies Locale[];

@Injectable()
export class I18nApiStub implements Partial<I18nApi> {
  async getLocales() {
    return LOCALES;
  }

  async getTranslations(locale: LocaleId) {
    const localeExists = LOCALES.some((loc) => loc.id === locale);

    if (!localeExists) {
      throw new Error(
        `[I18nApiStub]: no translations found for locale identifier '${locale}'.`,
      );
    }

    return { id: locale, localeId: locale, value: {} };
  }
}
