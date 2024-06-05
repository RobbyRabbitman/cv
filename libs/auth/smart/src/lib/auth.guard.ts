import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanMatchFn, Router } from '@angular/router';
import { UserStore } from '@cv/auth/data';
import { wrapToObservable } from '@cv/common/util';
import { createInjectionToken } from 'ngxtension/create-injection-token';
import { filter, switchMap } from 'rxjs';

export type AuthenticatedGuardConfig = {
  notAuthenticated: CanMatchFn;
  authenticated: CanMatchFn;
};

export const [authenticatedGuardConfig, provideAuthenticatedGuardConfig] =
  createInjectionToken(() => {
    const router = inject(Router);

    return {
      notAuthenticated: () => router.parseUrl('/'),
      authenticated: () => true,
    } as AuthenticatedGuardConfig;
  });

export const isAuthenticated: CanMatchFn = (
  ...args: Parameters<CanMatchFn>
) => {
  const user = inject(UserStore).value;
  const config = authenticatedGuardConfig();

  return toObservable(user)
    .pipe(filter((user) => user !== undefined))
    .pipe(
      switchMap((user) => {
        if (!user) {
          return wrapToObservable(config.notAuthenticated(...args));
        }

        return wrapToObservable(config.authenticated(...args));
      }),
    );
};
