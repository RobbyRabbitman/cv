import { inject, Injectable } from '@angular/core';
import {
  FIRESTORE,
  typedCollection,
  typedDoc,
} from '@robby-rabbitman/cv-libs-common-util';
import type { Locale, Translations } from '@robby-rabbitman/cv-libs-i18n-types';
import { collection, doc, getDoc } from 'firebase/firestore';

@Injectable()
export class I18nApi {
  protected readonly firestore = inject(FIRESTORE);

  protected readonly collections = {
    translation: typedCollection<Translations>(
      collection(this.firestore, 'translation'),
    ),
    i18n: collection(this.firestore, 'i18n'),
  };

  protected readonly docs = {
    i18n: {
      /** Information about translations. */
      translation: typedDoc<{ locales: Record<Locale, string> }>(
        doc(this.collections.i18n, 'translation'),
      ),
    },
  };

  async getLocales(): Promise<Locale[]> {
    const translation = (await getDoc(this.docs.i18n.translation)).data();

    if (!translation) {
      throw new Error(`[I18nApi]: translation information missing.`);
    }

    return Object.keys(translation.locales);
  }

  async getTranslations(locale: Locale): Promise<Record<string, unknown>> {
    const translations = await getDoc(
      doc(this.collections.translation, locale),
    );

    if (!translations.exists()) {
      throw new Error(
        `[I18nApi]: no translations found for locale '${locale}'.`,
      );
    }

    return translations.data();
  }
}
