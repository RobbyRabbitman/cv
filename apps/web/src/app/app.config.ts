import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideAuthData } from '@cv/auth/data';
import { isAuthenticated } from '@cv/auth/smart';
import { provideCommonData } from '@cv/common/data';
import { provideFirebase } from '@cv/common/util';
import { provideCvData } from '@cv/data';
import { provideI18nData } from '@cv/i18n/data';
import { provideI18nSmart } from '@cv/i18n/smart';
import { environment } from '../environments/environment';

export const appConfig = {
  providers: [
    provideRouter([
      { path: 'all', loadChildren: () => import('@cv--overview') },
      {
        path: 'all/:cvId',
        loadChildren: () => import('@cv--edit'),
        canActivate: [isAuthenticated],
        canMatch: [isAuthenticated],
      },
      { path: '**', pathMatch: 'full', redirectTo: 'all' },
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
