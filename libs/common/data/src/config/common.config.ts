import { makeEnvironmentProviders } from '@angular/core';
import { withColorScheme } from './with-color-scheme';
import { withCommonStore } from './with-common-store';

export function provideCommonData() {
  return makeEnvironmentProviders([withCommonStore(), withColorScheme()]);
}
