import {
  ENVIRONMENT_INITIALIZER,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { UserStore } from '@cv/auth/data';
import { filterNil } from 'ngxtension/filter-nil';
import { distinctUntilKeyChanged } from 'rxjs';
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
        const cv = inject(CvStore);
        const user = inject(UserStore);

        return () => {
          toObservable(user.value)
            .pipe(
              filterNil(),
              distinctUntilKeyChanged('uid'),
              takeUntilDestroyed(),
            )
            .subscribe(() => {
              cv.getAll();
              cv.getAllTemplates();
            });
        };
      },
    },
  ]);
}
