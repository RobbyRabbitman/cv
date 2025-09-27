import { provideHttpClient } from '@angular/common/http';
import {
  type ApplicationConfig,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
} from '@angular/router';
import { provideAuthData } from '@robby-rabbitman/cv-libs-auth-data';
import { provideFirebase } from '@robby-rabbitman/cv-libs-common-util';
import { provideCvData } from '@robby-rabbitman/cv-libs-cv-data';
import { reflectLocaleInDocument } from '@robby-rabbitman/cv-libs-i18n-components';
import { provideI18nData } from '@robby-rabbitman/cv-libs-i18n-data';
import { provideTranslation } from '@robby-rabbitman/cv-libs-i18n-features-translation';
import { environment } from '../environments/environment';
import { CV_APP_ROUTES } from './cv-routes';

export const CV_APP_CONFIG = {
  providers: [
    /** Change detection */
    provideZonelessChangeDetection(),

    /** Debugging */
    provideCheckNoChangesConfig({ interval: 1_000, exhaustive: true }),

    /** Router */
    provideRouter(
      CV_APP_ROUTES,
      withDebugTracing(),
      withComponentInputBinding(),
    ),

    /** Http client */
    provideHttpClient(),

    /** Firebase */
    provideFirebase(environment.firebase),

    /** Auth */
    provideAuthData(),

    /** I18n */
    provideI18nData(),
    provideTranslation(),
    reflectLocaleInDocument(),

    /** CV */
    provideCvData(),
  ],
} satisfies ApplicationConfig;
