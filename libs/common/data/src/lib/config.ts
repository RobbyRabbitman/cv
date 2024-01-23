import { makeEnvironmentProviders } from '@angular/core';
import { provideCommonStore } from './common.store';

export function provideCommonData() {
  return makeEnvironmentProviders([provideCommonStore()]);
}
