import { Environment } from './type';

export const environment: Environment = {
  stage: 'local',
  firebase: {
    features: {
      auth: { emulators: { host: 'localhost', port: 9099 } },
      firestore: { emulators: { host: 'localhost', port: 8080 } },
    },
    options: {
      apiKey: 'local',
      authDomain: 'local',
      projectId: 'local',
      storageBucket: 'local',
      messagingSenderId: 'local',
      appId: 'local',
      measurementId: 'local',
    },
  },
};
