import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { BlockPrototype, Cv, UUID } from '@cv/common-types';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  type,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { Api } from './api';

export function provideCvStore(): EnvironmentProviders {
  return makeEnvironmentProviders([CvStore]);
}

interface State {
  loading: boolean;
}

const initialState: State = {
  loading: false,
};

export const CvStore = signalStore(
  withState(initialState),
  withEntities({ entity: type<Cv>(), collection: 'cv' }),
  withEntities({ entity: type<BlockPrototype>(), collection: 'prototypes' }),
  withMethods((store) => {
    const api = inject(Api);

    return {
      /** Gets a block prototype by its id. */
      getPrototype: function (prototypeId: UUID) {
        return store.prototypesEntityMap()[prototypeId];
      },

      /** Gets a cv and its prototypes by its id. */
      getCv: rxMethod<UUID>(
        pipe(
          // noop when cv is already in store.
          filter((id) => !store.cvEntityMap()[id]),
          // indicate loading
          tap(() => patchState(store, { loading: true })),
          // call api
          switchMap((id) => api.getCvWithBlockPrototypes(id)),
          // handle response
          tapResponse({
            // success
            next: ({ cv, prototypes }) => {
              patchState(
                store,
                { loading: false },
                setEntity(cv, { collection: 'cv' }),
                setEntities(prototypes, {
                  collection: 'prototypes',
                }),
              );
            },
            // error
            error: () => {
              // TODO
            },
            // success or error
            finalize: () => {
              patchState(store, { loading: false });
            },
          }),
        ),
      ),
    };
  }),
);
