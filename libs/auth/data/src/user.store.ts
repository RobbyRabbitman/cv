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
      signOut: rxMethod<void>(pipe(exhaustMap(() => auth.signOut()))),

      /** Sign in. */
      signIn: rxMethod<void>(pipe(exhaustMap(() => auth.signIn()))),

      /** The user if logged in, else null. */
      user: auth.user,
    };
  }),
);
