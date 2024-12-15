import {
  type ApplicationConfig,
  provideExperimentalCheckNoChangesForDebug,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
} from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { cvAppRoutes } from './cv-app.routes';

export const cvAppConfig = {
  providers: [
    /** Change detection */
    provideExperimentalZonelessChangeDetection(),
    provideExperimentalCheckNoChangesForDebug({ interval: 1_000 }),

    /** Router */
    provideRouter(cvAppRoutes, withDebugTracing(), withComponentInputBinding()),

    /** Http client */
    provideHttpClient(),
  ],
} satisfies ApplicationConfig;
