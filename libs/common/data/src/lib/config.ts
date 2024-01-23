import {
  ENVIRONMENT_INITIALIZER,
  computed,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { applyTheme, injectDocumentTheme } from '@cv/common/util';
import { CommonStore, provideCommonStore } from './common.store';

export function provideCommonData() {
  return makeEnvironmentProviders([
    provideCommonStore(),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory: () => {
        const common = inject(CommonStore);
        const documentTheme = injectDocumentTheme();

        return () =>
          applyTheme(
            computed(() => {
              const theme = common.theme();

              if (theme === 'system') return documentTheme();

              return theme;
            }),
          );
      },
    },
  ]);
}
