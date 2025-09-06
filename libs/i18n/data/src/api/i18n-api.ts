import { inject, Injectable } from '@angular/core';
import { FIRESTORE } from '@robby-rabbitman/cv-libs-common-util';

@Injectable()
export class I18nApi {
  protected readonly firestore = inject(FIRESTORE);

  async getLocales(): Promise<Intl.UnicodeBCP47LocaleIdentifier[]> {
    return ['en', 'de'];
  }

  async getTranslations(
    locale: Intl.UnicodeBCP47LocaleIdentifier,
  ): Promise<Record<string, unknown>> {
    return {
      auth: {
        sign_in_button: {
          text: 'Sign in',
        },
        sign_out_button: {
          text: 'Sign out',
        },
      },
    };
  }
}
