import { makeEnvironmentProviders } from '@angular/core';
import { CommonStore } from '../store/common.store';

/** Provides the {@link CommonStore}. */
export function withCommonStore() {
  return makeEnvironmentProviders([CommonStore]);
}
