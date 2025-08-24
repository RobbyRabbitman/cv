import { type Environment } from './type';

export const environment = {
  stage: 'prod',
  firebase: {
    options: {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      measurementId: '',
    },
  },
} as const satisfies Environment;
