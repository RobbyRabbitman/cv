import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '@cv/auth/data';
import { filter, map } from 'rxjs';

// TODO make factory and pass redirect url?
export const isAuthenticated: CanActivateFn = () => {
  const user = inject(UserStore).value;
  const router = inject(Router);

  return toObservable(user).pipe(
    filter((user) => user !== undefined),
    map((user) => {
      if (!user) return router.createUrlTree(['/']);

      return true;
    }),
  );
};
