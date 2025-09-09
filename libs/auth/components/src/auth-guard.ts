import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { type CanActivateFn } from '@angular/router';
import { UserStore } from '@robby-rabbitman/cv-libs-auth-data';
import { filter, map } from 'rxjs';

export const authGuard = (() => {
  const user = inject(UserStore);

  /**
   * TODO: Should the auth guard redirect to the login page e.g. /login or
   * dispatch an event that an unauthenticated user tried to access a protected
   * route?
   */

  return toObservable(user.authResolved).pipe(
    filter(Boolean),
    map(() => user.value() != null),
  );
}) satisfies CanActivateFn;
