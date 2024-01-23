import {
  EnvironmentProviders,
  computed,
  makeEnvironmentProviders,
} from '@angular/core';
import { Theme } from '@cv/common/types';
import { injectDocumentTheme } from '@cv/common/util';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export function provideCommonStore(): EnvironmentProviders {
  return makeEnvironmentProviders([CommonStore]);
}

interface State {
  appName: string;
  theme: Theme | undefined;
}

export const CommonStore = signalStore(
  withState(() => {
    const initialState: State = {
      appName: 'CV',
      theme: undefined,
    };

    return initialState;
  }),
  withMethods((store) => {
    const documentTheme = injectDocumentTheme();

    return {
      theme: computed(() => store.theme() ?? documentTheme()),
      setTheme: function (theme: Theme) {
        patchState(store, { theme });
      },
    };
  }),
);
