import { makeEnvironmentProviders } from '@angular/core';
import { Api } from './api';
import { provideCvStore } from './cv.store';

export function provideCvData() {
  return makeEnvironmentProviders([provideCvStore(), Api]);
}
