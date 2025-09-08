import type { Provider } from '@angular/core';
import { I18nApi } from '@robby-rabbitman/cv-libs-i18n-data';
import { I18nApiStub } from './i18n-api-stub';

export function provideI18nApiTesting() {
  return [
    {
      provide: I18nApi,
      useClass: I18nApiStub,
    },
  ] satisfies Provider[];
}
