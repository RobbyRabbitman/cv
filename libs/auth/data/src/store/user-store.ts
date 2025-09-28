import { inject } from '@angular/core';
import { signalStore, type, withMethods, withProps } from '@ngrx/signals';
import { eventGroup, injectDispatch } from '@ngrx/signals/events';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { AuthApi } from '../api/auth-api';

export const userEvents = eventGroup({
  source: 'User',
  events: {
    signInSuccess: type<void>(),
    signInFailure: type<void>(),
    signOut: type<void>(),
  },
});

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
    const userEventDispatcher = injectDispatch(userEvents);

    return {
      /** Signs out the current user. */
      signOut: rxMethod<void>(
        pipe(
          exhaustMap(() => auth.signOut()),
          tap(() => userEventDispatcher.signOut()),
        ),
      ),

      /** Sign in. */
      signIn: rxMethod<void>(
        pipe(
          exhaustMap(() => auth.signIn()),
          tap((signInSuccess) => {
            if (signInSuccess) {
              userEventDispatcher.signInSuccess();
            } else {
              userEventDispatcher.signInFailure();
            }
          }),
        ),
      ),
    };
  }),
);
