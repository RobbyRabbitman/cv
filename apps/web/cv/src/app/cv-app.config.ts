import {
  type ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { cvAppRoutes } from './cv-app.routes';

export const cvAppConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(cvAppRoutes),
  ],
} satisfies ApplicationConfig;
