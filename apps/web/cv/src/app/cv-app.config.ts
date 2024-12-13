import {
  type ApplicationConfig,
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

    /** Router */
    provideRouter(cvAppRoutes, withDebugTracing(), withComponentInputBinding()),

    /** Http client */
    provideHttpClient(),
  ],
} satisfies ApplicationConfig;
