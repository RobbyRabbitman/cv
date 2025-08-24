import type { FirebaseConfig } from '@robby-rabbitman/cv-libs-common-util';

export interface Environment {
  stage: 'prod' | 'dev' | 'local';
  firebase: FirebaseConfig;
}
