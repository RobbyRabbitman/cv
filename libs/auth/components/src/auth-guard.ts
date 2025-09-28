import { inject } from '@angular/core';
import { RedirectCommand, Router, type CanActivateFn } from '@angular/router';
import { UserStore } from '@robby-rabbitman/cv-libs-auth-data';

export const authGuard = (async () => {
  const user = inject(UserStore);
  const router = inject(Router);

  await user.waitForResolvedValue;

  return user.value() ? true : new RedirectCommand(router.parseUrl('/'));
}) satisfies CanActivateFn;
