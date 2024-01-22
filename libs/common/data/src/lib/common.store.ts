import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { signalStore, withState } from '@ngrx/signals';

export function provideCommonStore(): EnvironmentProviders {
  return makeEnvironmentProviders([CommonStore]);
}

interface State {
  appName: string;
}

export const CommonStore = signalStore(
  withState(() => {
    const initialState: State = {
      appName: 'CV',
    };

    return initialState;
  }),
);
