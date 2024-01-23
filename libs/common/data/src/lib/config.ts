import {
  ENVIRONMENT_INITIALIZER,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { applyTheme } from '@cv/common/util';
import { CommonStore, provideCommonStore } from './common.store';

export function provideCommonData() {
  return makeEnvironmentProviders([
    provideCommonStore(),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory: () => {
        const common = inject(CommonStore);
        return () => applyTheme(common.theme);
      },
    },
  ]);
}
