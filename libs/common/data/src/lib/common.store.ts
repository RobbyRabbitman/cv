import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { THEMES, Theme } from '@cv/common/types';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export function provideCommonStore(): EnvironmentProviders {
  return makeEnvironmentProviders([CommonStore]);
}

interface State {
  appName: string;
  theme: Theme;
  themes: typeof THEMES;
}

export const CommonStore = signalStore(
  withState(() => {
    const initialState: State = {
      appName: 'CV',
      theme: 'system',
      themes: THEMES,
    };

    return initialState;
  }),
  withMethods((store) => {
    return {
      setTheme: function (theme: Theme) {
        patchState(store, { theme });
      },
    };
  }),
);
