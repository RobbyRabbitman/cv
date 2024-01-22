import { makeEnvironmentProviders } from '@angular/core';
import { Api } from './api';
import { provideCommonStore } from './common.store';
import { provideCvStore } from './cv.store';

export function provideCommonData() {
  return makeEnvironmentProviders([
    provideCvStore(),
    provideCommonStore(),
    Api,
  ]);
}
