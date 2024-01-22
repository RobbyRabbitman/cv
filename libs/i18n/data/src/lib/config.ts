import { HttpClient } from '@angular/common/http';
import {
  importProvidersFrom,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideI18nStore } from './i18n.store';

export function provideI18nData() {
  return makeEnvironmentProviders([
    provideI18nStore(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: () => {
            const http = inject(HttpClient);
            return {
              getTranslation: (locale) =>
                http.get(`assets/i18n/${locale}.json`), // TODO fetch from firestore?
            } satisfies TranslateLoader;
          },
        },
      }),
    ),
  ]);
}
