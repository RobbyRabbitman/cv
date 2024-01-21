import { Environment } from './type';

export const environment: Environment = {
  stage: 'local',
  firebase: {
    emulators: {
      auth: { host: 'localhost', port: 9099 },
      firestore: { host: 'localhost', port: 8080 },
    },
    apiKey: 'local',
    authDomain: 'local',
    projectId: 'local',
    storageBucket: 'local',
    messagingSenderId: 'local',
    appId: 'local',
    measurementId: 'local',
  },
};
