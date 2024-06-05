import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  effect,
  inject,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';

import { Router, provideRouter } from '@angular/router';
import { UserStore, provideAuthData } from '@cv/auth/data';
import {
  isAuthenticated,
  provideAuthenticatedGuardConfig,
} from '@cv/auth/smart';
import { provideCommonData } from '@cv/common/data';
import { provideFirebase, runOnEnvironmentInit } from '@cv/common/util';
import { provideCvData } from '@cv/data';
import { provideI18nData } from '@cv/i18n/data';
import { provideI18nSmart } from '@cv/i18n/smart';
import { environment } from '../environments/environment';

export const appConfig = {
  providers: [
    provideRouter([
      {
        path: 'welcome',
        loadComponent: () => import('./app').then((m) => m.WelcomePage),
        canMatch: [isAuthenticated],
        providers: [
          provideAuthenticatedGuardConfig(() => {
            const router = inject(Router);

            return {
              authenticated: () => router.parseUrl('/all'),
              notAuthenticated: () => true,
            };
          }),
          runOnEnvironmentInit(() => {
            const userStore = inject(UserStore);
            const router = inject(Router);
            effect(() => {
              const user = userStore.value();
              if (user) {
                router.navigateByUrl('/all');
              }
            });
          }),
        ],
      },
      {
        path: 'all',
        children: [
          { path: '', loadChildren: () => import('@cv--overview') },
          { path: ':cvId', loadChildren: () => import('@cv--edit') },
        ],
        providers: [
          provideAuthenticatedGuardConfig(() => {
            const router = inject(Router);

            return {
              authenticated: () => true,
              notAuthenticated: () => router.parseUrl('/welcome'),
            };
          }),
          runOnEnvironmentInit(() => {
            const userStore = inject(UserStore);
            const router = inject(Router);

            effect(() => {
              const user = userStore.value();

              if (!user) {
                router.navigateByUrl('/welcome');
              }
            });
          }),
        ],
        canMatch: [isAuthenticated],
      },
      { path: '**', pathMatch: 'full', redirectTo: '/welcome' },
    ]),
    provideFirebase(environment.firebase),
    provideCommonData(),
    provideCvData(),
    provideAuthData(),
    provideI18nData(),
    provideI18nSmart(),
    provideHttpClient(),
    provideExperimentalZonelessChangeDetection(),
  ],
} satisfies ApplicationConfig;
