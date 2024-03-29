import { makeEnvironmentProviders } from '@angular/core';
import { provideI18nStore, provideTranslationApi } from './i18n.store';

export function provideI18nData() {
  return makeEnvironmentProviders([
    provideI18nStore(),
    provideTranslationApi(),
  ]);
}
