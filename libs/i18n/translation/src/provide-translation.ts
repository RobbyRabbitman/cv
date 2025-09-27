import {
  makeEnvironmentProviders,
  type EnvironmentProviders,
} from '@angular/core';
import { TitleStrategy } from '@angular/router';
import type { I18nToNgxTranslate } from './ngx-translate-interop/i18n-to-ngx-translate';
import { provideNgxTranslateInterop } from './ngx-translate-interop/provide-ngx-translate-interop';
import { TranslatedTitle } from './translated-title';

export function provideTranslation(dependencies: {
  i18n: () => I18nToNgxTranslate;
}) {
  return [
    ...provideNgxTranslateInterop({ i18n: dependencies.i18n }),
    makeEnvironmentProviders([
      {
        provide: TitleStrategy,
        useClass: TranslatedTitle,
      },
    ]),
  ] satisfies EnvironmentProviders[];
}
