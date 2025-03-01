import { provideHttpClient } from '@angular/common/http';
import {
  type ApplicationConfig,
  provideExperimentalCheckNoChangesForDebug,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
} from '@angular/router';
import {
  provideCommonData,
  withColorScheme,
  withCommonStore,
} from '@robby-rabbitman/cv-libs-common-data';
import { cvAppRoutes } from './cv-app.routes';

export const cvAppConfig = {
  providers: [
    /** Change detection */
    provideExperimentalZonelessChangeDetection(),

    /** Debugging */
    provideExperimentalCheckNoChangesForDebug({ interval: 1_000 }),

    /** Router */
    provideRouter(cvAppRoutes, withDebugTracing(), withComponentInputBinding()),

    /** Http client */
    provideHttpClient(),

    /** Animations */
    provideAnimationsAsync('animations'),

    /** Common */
    provideCommonData(withCommonStore(), withColorScheme()),
  ],
} satisfies ApplicationConfig;
