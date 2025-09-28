import { inject, provideEnvironmentInitializer } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Events } from '@ngrx/signals/events';
import { from, switchMap } from 'rxjs';
import { userEvents } from '../store/user-store';

export function redirectOnSignIn(route: string) {
  return provideEnvironmentInitializer(() => {
    const events = inject(Events);
    const router = inject(Router);

    events
      .on(userEvents.signInSuccess)
      .pipe(
        switchMap(() => from(router.navigateByUrl(route))),
        takeUntilDestroyed(),
      )
      .subscribe();
  });
}
