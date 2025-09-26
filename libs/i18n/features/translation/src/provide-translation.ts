import {
  makeEnvironmentProviders,
  type EnvironmentProviders,
} from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { provideNgxTranslateInterop } from './ngx-translate-interop/provide-ngx-translate-interop';
import { TranslatedTitle } from './translated-title';

export function provideTranslation() {
  return [
    ...provideNgxTranslateInterop(),
    makeEnvironmentProviders([
      {
        provide: TitleStrategy,
        useClass: TranslatedTitle,
      },
    ]),
  ] satisfies EnvironmentProviders[];
}
