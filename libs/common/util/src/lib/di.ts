import {
  ENVIRONMENT_INITIALIZER,
  makeEnvironmentProviders,
} from '@angular/core';

export function runOnEnvironmentInit(initFn: () => void) {
  return makeEnvironmentProviders([
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory: () => initFn,
    },
  ]);
}
