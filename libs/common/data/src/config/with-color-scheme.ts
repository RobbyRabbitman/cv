import { inject, provideEnvironmentInitializer } from '@angular/core';
import {
  type ColorSchemeOptions,
  setColorScheme,
} from '@robby-rabbitman/cv-libs-common-util';
import { CommonStore } from '../store/common.store';

/** Sets the color scheme based on the state of the common store. */
export function withColorScheme(
  options?: Pick<ColorSchemeOptions, 'targetElement'>,
) {
  return provideEnvironmentInitializer(() => {
    const commonStore = inject(CommonStore);
    setColorScheme({
      colorScheme: commonStore.colorScheme,
      targetElement: options?.targetElement,
    });
  });
}
