import {
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { setColorScheme } from '@robby-rabbitman/cv-libs-common-util';
import { CommonStore } from '../store/common.store';

/**
 * Sets the color scheme on the root element based on the state of the common
 * store.
 */
export function withColorScheme() {
  return makeEnvironmentProviders([
    provideEnvironmentInitializer(() => {
      const commonStore = inject(CommonStore);
      setColorScheme({
        colorScheme: commonStore.colorScheme,
      });
    }),
  ]);
}
