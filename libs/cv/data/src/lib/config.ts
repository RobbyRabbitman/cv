import { makeEnvironmentProviders } from '@angular/core';
import { provideCvStore } from './cv.store';

export function provideCvData() {
  return makeEnvironmentProviders([provideCvStore()]);
}
