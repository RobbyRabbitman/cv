import { provideHttpClient } from '@angular/common/http';
import {
  type ApplicationConfig,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
} from '@angular/router';
import { CV_APP_ROUTES } from './routes';

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

    /** Animations */
    provideAnimationsAsync('animations'),
  ],
} satisfies ApplicationConfig;
