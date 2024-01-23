import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  makeEnvironmentProviders,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';
import { provideAuthData } from '@cv/auth/data';
import { provideCommonData } from '@cv/common/data';
import { provideCvData } from '@cv/data';
import { provideI18nData } from '@cv/i18n/data';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

function provideFirebase() {
  return makeEnvironmentProviders([
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      // auth
      provideAuth(() => {
        const auth = getAuth();
        const emulators = environment.firebase.emulators;

        if (emulators?.auth) {
          connectAuthEmulator(
            auth,
            `http://${emulators.auth.host}:${emulators.auth.port}`,
          );
        }

        return auth;
      }),
      // firestore
      provideFirestore(() => {
        const firestore = getFirestore();
        const emulators = environment.firebase.emulators;

        if (emulators?.firestore) {
          connectFirestoreEmulator(
            firestore,
            emulators.firestore.host,
            emulators.firestore.port,
          );
        }

        return firestore;
      }),
    ]),
  ]);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideFirebase(),
    provideCommonData(),
    provideCvData(),
    provideAuthData(),
    provideI18nData(),
    provideHttpClient(),
  ],
};
