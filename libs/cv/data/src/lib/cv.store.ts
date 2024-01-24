import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { Identifiable, UUID } from '@cv/common/types';
import { BlockPrototype, Blocks, Cv } from '@cv/types';
import { patchBlock as _patchBlock } from '@cv/util';
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
import { debounceTime, filter, pipe, switchMap, tap } from 'rxjs';
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

    /** Gets a cv and its prototypes by its id. */
    const getOne = rxMethod<UUID>(
      pipe(
        // noop when cv is already in store.
        filter((id) => !store.cvEntityMap()[id]),
        // indicate loading
        tap(() => patchState(store, { loading: true })),
        // call api
        switchMap((id) => api.getOneWithPrototypes(id)),
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
    );

    /** Creates a new cv. */
    const create = rxMethod<void>(
      pipe(
        // indicate loading
        tap(() => patchState(store, { loading: true })),
        // call api
        switchMap(() => api.create()),
        // handle response
        tapResponse({
          // success
          next: (id) => {
            patchState(store, { loading: false });
            getOne(id);
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
    );

    /** Get all cvs of the user. */
    const getAll = rxMethod<void>(
      pipe(
        // indicate loading
        tap(() => patchState(store, { loading: true })),
        // call api
        switchMap(() => api.getAll()),
        // handle response
        tapResponse({
          // success
          next: (cvs) => {
            patchState(
              store,
              { loading: false },
              setEntities(cvs, {
                collection: 'cv',
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
    );

    /** Updates a CV. */
    const update = rxMethod<Cv>(
      pipe(
        // indicate loading
        tap((cv) =>
          patchState(
            store,
            { loading: true },
            setEntity(cv, { collection: 'cv' }),
          ),
        ),
        // throttle
        debounceTime(300),
        // call api
        switchMap((cv) => api.update(cv)),
        // handle response
        tapResponse({
          // success
          next: () => {
            patchState(store, { loading: false });
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
    );

    const patchBlock = function <TBlock extends Blocks>(
      cv: Cv,
      block: Partial<TBlock> & Identifiable,
    ) {
      update(_patchBlock(cv, block));
    };

    return {
      /** Gets a block prototype by its id. */
      getPrototype: function (prototypeId: UUID) {
        return store.prototypesEntityMap()[prototypeId];
      },
      create,
      update,
      getOne,
      getAll,
      patchBlock,
    };
  }),
);
