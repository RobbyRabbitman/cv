import { makeEnvironmentProviders } from '@angular/core';
import { provideCommonStore } from '../store/common.store';
import { withColorScheme } from './with-color-scheme';

export function provideCommonData() {
  return makeEnvironmentProviders([provideCommonStore(), withColorScheme()]);
}
