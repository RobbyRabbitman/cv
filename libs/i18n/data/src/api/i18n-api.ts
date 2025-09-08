import { inject, Injectable } from '@angular/core';
import { FIRESTORE, idConverter } from '@robby-rabbitman/cv-libs-common-util';
import type {
  Locale,
  LocaleId,
  Translations,
} from '@robby-rabbitman/cv-libs-i18n-types';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

@Injectable()
export class I18nApi {
  protected readonly firestore = inject(FIRESTORE);

  protected readonly collections = {
    translation: collection(this.firestore, 'translation').withConverter<
      Translations,
      Translations['value']
    >({
      toFirestore: (entity: Translations) => entity.value,
      fromFirestore: (
        snapshot: QueryDocumentSnapshot<Translations['value']>,
        options,
      ) => ({
        id: snapshot.id,
        localeId: snapshot.id,
        value: snapshot.data(options),
      }),
    }),
    locale: collection(this.firestore, 'locale').withConverter(
      idConverter<Locale>(),
    ),
  };

  /** Gets all available locales. */
  async getLocales() {
    const localesQuery = await getDocs(this.collections.locale);

    return localesQuery.docs.map((doc) => doc.data());
  }

  /** Gets the translations for a certain locale. */
  async getTranslations(locale: LocaleId) {
    const translations = await getDoc(
      doc(this.collections.translation, locale),
    );

    if (!translations.exists()) {
      throw new Error(
        `[I18nApi]: no translations found for locale identifier '${locale}'.`,
      );
    }

    return translations.data();
  }
}
