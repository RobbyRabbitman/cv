import { makeEnvironmentProviders } from '@angular/core';
import { withColorScheme } from './with-color-scheme';
import { provideCommonStore } from './with-common-store';

export function provideCommonData() {
  return makeEnvironmentProviders([provideCommonStore(), withColorScheme()]);
}
