import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe } from 'rxjs';
import { AuthApi } from '../api/auth-api';

export const UserStore = signalStore(
  withMethods(() => {
    const auth = inject(AuthApi);

    return {
      /** Signs out the current user. */
      signOut: rxMethod<void>(pipe(exhaustMap(() => auth.signOut()))),

      /** Sign in. */
      signIn: rxMethod<void>(pipe(exhaustMap(() => auth.signIn()))),

      /**
       * The user if logged in, else null. Undefined while the auth process has
       * not been resovled yet.
       */
      value: auth.user,
    };
  }),
);
