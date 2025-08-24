import { InjectionToken, type Provider } from '@angular/core';
import {
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app';
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth';
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from 'firebase/firestore';

export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FIREBASE_APP');

export const FIRESTORE = new InjectionToken<Firestore>('FIRESTORE');

export const FIREBASE_AUTH = new InjectionToken<Auth>('FIREBASE_AUTH');

export function provideFirebase({ options, features }: FirebaseConfig) {
  const firebaseApp = initializeApp(options);
  const providers: Provider[] = [
    {
      provide: FIREBASE_APP,
      useValue: firebaseApp,
    },
  ];

  for (const feature in features) {
    switch (feature) {
      case 'auth': {
        const auth = getAuth(firebaseApp);
        providers.push({
          provide: FIREBASE_AUTH,
          useValue: auth,
        });

        const emulators = features[feature]?.emulators;

        if (emulators) {
          connectAuthEmulator(
            auth,
            `http://${emulators.host}:${emulators.port}`,
          );
        }

        break;
      }
      case 'firestore': {
        const firestore = getFirestore(firebaseApp);
        providers.push({
          provide: FIRESTORE,
          useValue: firestore,
        });

        const emulators = features[feature]?.emulators;

        if (emulators) {
          connectFirestoreEmulator(firestore, emulators.host, emulators.port);
        }

        break;
      }
    }
  }

  return providers;
}

export interface FirebaseConfig {
  options: FirebaseOptions;
  features?: Partial<{
    auth: {
      emulators?: { host: string; port: number };
    };
    firestore: {
      emulators?: { host: string; port: number };
    };
  }>;
}
