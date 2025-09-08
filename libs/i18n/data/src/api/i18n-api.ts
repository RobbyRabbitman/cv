import { inject, Injectable } from '@angular/core';
import { applyDocId, FIRESTORE } from '@robby-rabbitman/cv-libs-common-util';
import type {
  Locale,
  LocaleId,
  Translations,
} from '@robby-rabbitman/cv-libs-i18n-types';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

@Injectable()
export class I18nApi {
  protected readonly firestore = inject(FIRESTORE);

  protected readonly collections = {
    translation: applyDocId<Translations['value']>(
      collection(this.firestore, 'translation'),
    ).withConverter<Translations>({
      toFirestore: (entity) => entity.value ?? {},
      fromFirestore: (snapshot, options) => ({
        localeId: snapshot.id,
        value: snapshot.data(options),
      }),
    }),
    locale: applyDocId<Locale>(collection(this.firestore, 'locale')),
  };

  async getLocales() {
    const localesQuery = await getDocs(this.collections.locale);

    return localesQuery.docs.map((doc) => doc.data());
  }

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
