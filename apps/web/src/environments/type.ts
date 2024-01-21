import { FirebaseOptions } from '@angular/fire/app';

export interface Environment {
  stage: 'prod' | 'dev' | 'local';
  firebase: FirebaseOptions & {
    emulators?: Record<
      'firestore' | 'auth',
      {
        host: string;
        port: number;
      }
    >;
  };
}
