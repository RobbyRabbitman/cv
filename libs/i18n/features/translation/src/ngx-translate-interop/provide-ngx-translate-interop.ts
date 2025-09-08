import {
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
  type EnvironmentProviders,
} from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { i18nToNgxTranslate } from './i18n-to-ngx-translate';

export function provideNgxTranslateInterop() {
  return [
    makeEnvironmentProviders(provideTranslateService()),
    provideEnvironmentInitializer(i18nToNgxTranslate),
  ] satisfies EnvironmentProviders[];
}
