import {
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
  type EnvironmentProviders,
} from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import {
  I18N_TO_NGX_TRANSLATE,
  i18nToNgxTranslate,
  type I18nToNgxTranslate,
} from './i18n-to-ngx-translate';
import { Translate } from './translate';

export function provideNgxTranslateInterop(dependencies: {
  i18n: () => I18nToNgxTranslate;
}) {
  return [
    makeEnvironmentProviders([
      provideTranslateService(),
      Translate,
      { provide: I18N_TO_NGX_TRANSLATE, useFactory: dependencies.i18n },
    ]),
    provideEnvironmentInitializer(i18nToNgxTranslate),
  ] satisfies EnvironmentProviders[];
}
