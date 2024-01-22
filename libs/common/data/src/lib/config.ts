import { makeEnvironmentProviders } from '@angular/core';
import { Api } from './api';
import { provideCvStore } from './cv.store';

export function provideCommonData() {
  return makeEnvironmentProviders([provideCvStore(), Api]);
}
