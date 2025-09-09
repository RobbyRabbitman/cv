import { inject } from '@angular/core';
import { signalStore, withMethods, withProps } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe } from 'rxjs';
import { AuthApi } from '../api/auth-api';

export const UserStore = signalStore(
  withProps(() => {
    const auth = inject(AuthApi);

    return {
      /**
       * The user if logged in, else null. Undefined while the auth process has
       * not been resovled yet.
       */
      value: auth.user,

      /** A promise that resolves once the auth state has been resolved. */
      waitForResolvedValue: auth.waitForResolved,
    };
  }),

  withMethods(() => {
    const auth = inject(AuthApi);

    return {
      /** Signs out the current user. */
      signOut: rxMethod<void>(pipe(exhaustMap(() => auth.signOut()))),

      /** Sign in. */
      signIn: rxMethod<void>(pipe(exhaustMap(() => auth.signIn()))),
    };
  }),
);
