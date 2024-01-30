import {
  EnvironmentProviders,
  computed,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { EntityStatus, Identifiable, UUID } from '@cv/common/types';
import { uuid } from '@cv/common/util';
import { Translation } from '@cv/i18n/types';
import {
  Block,
  BlockPrototype,
  Blocks,
  Cv,
  CvTemplate,
  HasChildren,
} from '@cv/types';
import {
  getChildPrototypes as _getChildPrototypes,
  patchBlock as _patchBlock,
} from '@cv/util';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  type,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  setAllEntities,
  setEntities,
  setEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, filter, from, pipe, switchMap, tap } from 'rxjs';
import { Api } from './api';

export function provideCvStore(): EnvironmentProviders {
  return makeEnvironmentProviders([CvStore]);
}

interface State {
  cvStatusMap: Record<UUID, EntityStatus>;
}

const initialState: State = {
  cvStatusMap: {},
};

export const CvStore = signalStore(
  withState(initialState),
  withEntities({ entity: type<Cv>(), collection: 'cv' }),
  withEntities({
    entity: type<CvTemplate & { translations: Record<string, Translation> }>(),
    collection: 'template',
  }),
  withEntities({ entity: type<BlockPrototype>(), collection: 'prototype' }),

  withMethods((store) => {
    const api = inject(Api);

    const cvStatus = function (cvId: UUID) {
      return computed(() => store.cvStatusMap()[cvId] ?? 'unknown');
    };

    const setStatus = function (status: EntityStatus, ...ids: UUID[]) {
      return (store: { cvStatusMap: Record<UUID, EntityStatus> }) => ({
        cvStatusMap: {
          ...store.cvStatusMap,
          ...ids.reduce(
            (map, id) => {
              map[id] = status;
              return map;
            },
            {} as Record<UUID, EntityStatus>,
          ),
        },
      });
    };

    /** Gets a cv and its prototypes by its id. */
    const getOne = rxMethod<UUID>(
      pipe(
        // noop when cv is already in store.
        filter((id) => {
          const cv = store.cvEntityMap()[id];
          return !(cv && store.prototypeEntityMap()[cv.prototypeId]);
        }),
        // indicate loading
        tap((id) => patchState(store, setStatus('loading', id))),
        // call api
        switchMap((id) =>
          from(api.getOneWithPrototypes(id)).pipe(
            // handle response
            tapResponse({
              // success
              next: ({ cv, prototypes }) => {
                patchState(
                  store,
                  setStatus('success', id, ...prototypes.map(({ id }) => id)),
                  setEntity(cv, { collection: 'cv' }),
                  setEntities(prototypes, {
                    collection: 'prototype',
                  }),
                );
              },
              // error
              error: () => {
                patchState(store, setStatus('error', id));
              },
            }),
          ),
        ),
      ),
    );

    /** Creates a new cv. */
    const create = rxMethod<{ cvPrototypeId: UUID; cvId: UUID }>(
      pipe(
        // indicate loading
        tap(({ cvId }) => patchState(store, setStatus('loading', cvId))),
        // call api
        switchMap(({ cvPrototypeId, cvId }) =>
          from(api.createCv(cvPrototypeId, cvId)).pipe(
            // handle response
            tapResponse({
              // success
              next: ({ id }) => {
                getOne(id);
              },
              // error
              error: () => {
                patchState(store, setStatus('error', cvId));
              },
            }),
          ),
        ),
      ),
    );

    /** Get all cvs of the user. */
    const getAll = rxMethod<void>(
      pipe(
        // indicate loading
        tap(() => patchState(store)),
        // call api
        switchMap(() =>
          from(api.getAllCvs()).pipe(
            // handle response
            tapResponse({
              // success
              next: (cvs) => {
                patchState(
                  store,
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
                patchState(store);
              },
            }),
          ),
        ),
      ),
    );

    /** Updates a CV. */
    const update = rxMethod<Cv>(
      pipe(
        // indicate loading
        tap((cv) =>
          patchState(
            store,
            setStatus('loading', cv.id),
            setEntity(cv, { collection: 'cv' }),
          ),
        ),
        // throttle
        debounceTime(300),
        // call api
        switchMap((cv) =>
          from(api.updateCv(cv)).pipe(
            // handle response
            tapResponse({
              // success
              next: () => {
                patchState(store);
              },
              // error
              error: () => {
                // TODO
              },
              // success or error
              finalize: () => {
                patchState(store);
              },
            }),
          ),
        ),
      ),
    );

    /** Updates a CV. */
    const getAllTemplates = rxMethod<void>(
      pipe(
        // call api
        switchMap(() =>
          from(api.getAllCvTemplates()).pipe(
            // handle response
            tapResponse({
              // success
              next: (templates) => {
                patchState(
                  store,
                  setEntities(
                    templates.map((template) => ({
                      ...template,
                      translations: {},
                    })),
                    {
                      collection: 'template',
                    },
                  ),
                );
              },
              // error
              error: () => {
                // TODO
              },
              // success or error
              finalize: () => {
                patchState(store);
              },
            }),
          ),
        ),
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
        return store.prototypeEntityMap()[prototypeId];
      },
      /** Gets a block prototype by its id. */
      getChildPrototypes: function <
        TChild extends Block,
        TBlock extends Block & HasChildren<TChild>,
      >(block: TBlock) {
        return computed(() =>
          _getChildPrototypes<TChild, TBlock>(
            block,
            store.prototypeEntityMap(),
          ),
        );
      },
      reset: function () {
        patchState(
          store,
          initialState,
          setAllEntities([] as Cv[], { collection: 'cv' }),
          setAllEntities(
            [] as (CvTemplate & {
              translations: Record<string, Translation>;
            })[],
            { collection: 'template' },
          ),
          setAllEntities([] as BlockPrototype[], { collection: 'prototype' }),
        );
      },
      cvStatus,
      create: function (cvPrototypeId: UUID) {
        const cvId = uuid();
        create({ cvPrototypeId, cvId });
        return cvId;
      },
      translation: function (cvTemplateId: UUID, locale: string) {
        return computed(() => {
          const translation =
            store.templateEntityMap()[cvTemplateId].translations[locale];

          if (!translation) return;

          return translation;
        });
      },
      update,
      getOne,
      getAll,
      patchBlock,
      getAllTemplates,
      getTranslation: rxMethod<{ cvTemplateId: UUID; locale: string }>(
        pipe(
          switchMap(({ locale, cvTemplateId }) =>
            from(api.getTranslation(cvTemplateId, locale)).pipe(
              // handle response
              tapResponse({
                // success
                next: (translation) => {
                  const cvTemplate = store.templateEntityMap()[cvTemplateId];

                  patchState(
                    store,
                    updateEntity(
                      {
                        id: cvTemplateId,
                        changes: {
                          translations: {
                            ...cvTemplate.translations,
                            [locale]: translation,
                          },
                        },
                      },
                      {
                        collection: 'template',
                      },
                    ),
                  );
                },
                // error
                error: () => {
                  // TODO
                },
              }),
            ),
          ),
        ),
      ),
    };
  }),
);
