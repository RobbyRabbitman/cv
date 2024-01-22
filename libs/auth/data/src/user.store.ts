import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe } from 'rxjs';
import { Auth } from './auth';

export function provideUserStore(): EnvironmentProviders {
  return makeEnvironmentProviders([UserStore]);
}

export const UserStore = signalStore(
  withMethods(() => {
    const auth = inject(Auth);

    return {
      /** Signs out the current user. */
      signout: rxMethod<void>(pipe(exhaustMap(() => auth.signout()))),

      /** Sign in. */
      signin: rxMethod<void>(pipe(exhaustMap(() => auth.signin()))),

      /** The user if logged in, else null. */
      user: auth.user,
    };
  }),
);
