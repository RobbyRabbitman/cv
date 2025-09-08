import { type EnvironmentProviders } from '@angular/core';
import { provideNgxTranslateInterop } from './ngx-translate-interop/provide-ngx-translate-interop';

export function provideTranslation() {
  return [...provideNgxTranslateInterop()] satisfies EnvironmentProviders[];
}
