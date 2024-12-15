import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  COLOR_SCHEMES,
  type ColorScheme,
} from '@robby-rabbitman/cv-libs-common-types';

/** @see {@link CommonStore} */
export interface CommonState {
  appName: string;
  colorScheme: ColorScheme;
  colorSchemes: typeof COLOR_SCHEMES;
}

export const CommonStore = signalStore(
  withState(() => {
    const initialState: CommonState = {
      appName: 'CV',
      colorScheme: 'system',
      colorSchemes: COLOR_SCHEMES,
    };

    return initialState;
  }),

  withMethods((store) => {
    return {
      setColorScheme: (colorScheme: ColorScheme) => {
        patchState(store, { colorScheme });
      },
    };
  }),
);
