import {
  ENVIRONMENT_INITIALIZER,
  effect,
  inject,
  makeEnvironmentProviders,
  untracked,
} from '@angular/core';
import { UserStore } from '@cv/auth/data';
import { Api } from './api';
import { CvStore, provideCvStore } from './cv.store';
import { provideMockData } from './tmp-api';

export function provideCvData() {
  return makeEnvironmentProviders([
    provideCvStore(),
    provideMockData,
    Api,
    // get all cvs
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory: () => {
        const cvStore = inject(CvStore);
        const userStore = inject(UserStore);

        return () =>
          effect(() => {
            const user = userStore.value();

            untracked(() => {
              switch (true) {
                case user === undefined:
                  break;
                case user == null:
                  cvStore.reset();
                  break;
                default:
                  cvStore.getAll();
                  cvStore.getAllTemplates();
              }
            });
          });
      },
    },
  ]);
}
