import { FirebaseConfig } from '@cv/common/util';

export interface Environment {
  stage: 'prod' | 'dev' | 'local';
  firebase: FirebaseConfig;
}
