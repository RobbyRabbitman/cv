import { inject } from '@angular/core';
import { type CanActivateFn } from '@angular/router';
import { UserStore } from '@robby-rabbitman/cv-libs-auth-data';

export const authGuard = (async () => {
  const user = inject(UserStore);

  await user.waitForResolvedValue;

  /**
   * TODO: Should the auth guard redirect to the login page e.g. /login or
   * dispatch an event that an unauthenticated user tried to access a protected
   * route?
   */
  return user.value() != null;
}) satisfies CanActivateFn;
