import { type Environment } from './type';

export const environment: Environment = {
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
};
