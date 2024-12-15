import { makeEnvironmentProviders } from '@angular/core';
import { CommonStore } from '../store/common.store';

/** Provides the {@link CommonStore}. */
export function provideCommonStore() {
  return makeEnvironmentProviders([CommonStore]);
}
