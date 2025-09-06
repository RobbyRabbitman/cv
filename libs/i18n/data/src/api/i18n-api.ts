import { inject, Injectable } from '@angular/core';
import { FIRESTORE } from '@robby-rabbitman/cv-libs-common-util';
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
} from 'firebase/firestore';

@Injectable()
export class I18nApi {
  protected readonly firestore = inject(FIRESTORE);

  protected readonly collections = {
    translation: collection(
      this.firestore,
      'translation',
    ) as TranslationCollection,
    i18n: collection(this.firestore, 'i18n'),
  };

  async getLocales(): Promise<Intl.UnicodeBCP47LocaleIdentifier[]> {
    const translation = (
      await getDoc(doc(this.collections.i18n, 'translation'))
    ).data() as {
      locales: Record<Intl.UnicodeBCP47LocaleIdentifier, DocumentReference>;
    };

    return Object.keys(translation.locales);
  }

  async getTranslations(
    locale: Intl.UnicodeBCP47LocaleIdentifier,
  ): Promise<Record<string, unknown>> {
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

type TranslationCollection = CollectionReference<
  Record<string, unknown>,
  Record<string, unknown>
>;
