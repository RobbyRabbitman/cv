import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  ɵprovideZonelessChangeDetection,
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideAuthData } from '@cv/auth/data';
import { provideCommonData } from '@cv/common/data';
import { provideFirebase } from '@cv/common/util';
import { provideCvData } from '@cv/data';
import { provideI18nData } from '@cv/i18n/data';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideFirebase(environment.firebase),
    provideCommonData(),
    provideCvData(),
    provideAuthData(),
    provideI18nData(),
    provideHttpClient(),
    ɵprovideZonelessChangeDetection(),
  ],
};
