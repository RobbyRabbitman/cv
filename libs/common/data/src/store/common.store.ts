import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  COLOR_SCHEMES,
  type ColorScheme,
} from '@robby-rabbitman/cv-libs-common-types';

/** @see {@link CommonStore} */
export interface CommonState {
  /** The name of the application. */
  appName: string;

  /** The preferred color scheme of the user for the application. */
  colorScheme: ColorScheme;

  /** The available color schemes for the application. */
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
      /** Sets the preferred color scheme of the user for the application. */
      setColorScheme: (colorScheme: ColorScheme) => {
        patchState(store, { colorScheme });
      },
    };
  }),
);
