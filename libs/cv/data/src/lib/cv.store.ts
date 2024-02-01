import {
  EnvironmentProviders,
  Injectable,
  computed,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { Identifiable, UUID } from '@cv/common/types';
import { setEntityStatus, uuid, withEntityStatus } from '@cv/common/util';
import { Translation } from '@cv/i18n/types';
import { Block, BlockPrototype, Blocks, Cv, CvTemplate } from '@cv/types';
import {
  getChildPrototypes as _getChildPrototypes,
  patchBlock as _patchBlock,
} from '@cv/util';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, type } from '@ngrx/signals';
import {
  setAllEntities,
  setEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, filter, from, map, pipe, switchMap, tap } from 'rxjs';
import { Api } from './api';

export function provideCvStore(): EnvironmentProviders {
  return makeEnvironmentProviders([CvStore]);
}

interface CvTranslation {
  id: string;
  value: Translation;
}

const buildCvTranslationId = (cvTemplateId: UUID, locale: string) =>
  `${cvTemplateId}_${locale}`;

const State = signalStore(
  withEntities({ entity: type<Cv>(), collection: 'cv' }),
  withEntities({
    entity: type<CvTemplate>(),
    collection: 'template',
  }),
  withEntities({ entity: type<BlockPrototype>(), collection: 'prototype' }),
  withEntities({
    entity: type<CvTranslation>(),
    collection: 'translation',
  }),
  withEntityStatus('cv'),
  withEntityStatus('prototype'),
  withEntityStatus('template'),
  withEntityStatus('translation'),
);

@Injectable()
export class CvStore extends State {
  api = inject(Api);

  /** Gets a cv and its prototypes by its id. */
  getOne = rxMethod<UUID>(
    pipe(
      // noop when cv is already in store.
      filter((id) => {
        const cv = this.cvEntityMap()[id];
        return !(cv && this.prototypeEntityMap()[cv.prototypeId]);
      }),
      // indicate loading
      tap((id) => patchState(this, setEntityStatus('cv', 'loading', id))),
      // call api
      switchMap((id) =>
        from(this.api.getOneWithPrototypes(id)).pipe(
          // handle response
          tapResponse({
            // success
            next: ({ cv, prototypes }) => {
              patchState(
                this,
                setEntityStatus('cv', 'success', id),
                setEntityStatus(
                  'prototype',
                  'success',
                  ...prototypes.map(({ id }) => id),
                ),
                setEntity(cv, { collection: 'cv' }),
                setEntities(prototypes, {
                  collection: 'prototype',
                }),
              );
            },
            // error
            error: () => {
              patchState(this, setEntityStatus('cv', 'error', id));
            },
          }),
        ),
      ),
    ),
  );

  /** Creates a new cv. */
  create = (() => {
    const _create = rxMethod<{ cvPrototypeId: UUID; cvId: UUID }>(
      pipe(
        // indicate loading
        tap(({ cvId }) =>
          patchState(this, setEntityStatus('cv', 'loading', cvId)),
        ),
        // call api
        switchMap(({ cvPrototypeId, cvId }) =>
          from(this.api.createCv(cvPrototypeId, cvId)).pipe(
            // handle response
            tapResponse({
              // success
              next: ({ id }) => {
                this.getOne(id);
              },
              // error
              error: () => {
                patchState(this, setEntityStatus('cv', 'error', cvId));
              },
            }),
          ),
        ),
      ),
    );

    return (cvPrototypeId: UUID) => {
      const cvId = uuid();
      _create({ cvPrototypeId, cvId });
      return cvId;
    };
  })();

  /** Get all cvs of the user. */
  getAll = rxMethod<void>(
    pipe(
      // call api
      switchMap(() =>
        from(this.api.getAllCvs()).pipe(
          // handle response
          tapResponse({
            // success
            next: (cvs) => {
              patchState(
                this,
                setEntities(cvs, {
                  collection: 'cv',
                }),
                setEntityStatus('cv', 'success', ...cvs.map(({ id }) => id)),
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
  );

  /** Updates a CV. */
  update = rxMethod<Cv>(
    pipe(
      // indicate loading
      tap((cv) =>
        patchState(
          this,
          setEntityStatus('cv', 'loading', cv.id),
          setEntity(cv, { collection: 'cv' }),
        ),
      ),
      // throttle
      debounceTime(300),
      // call api
      switchMap((cv) =>
        from(this.api.updateCv(cv)).pipe(
          // handle response
          tapResponse({
            // success
            next: () => {
              patchState(this, setEntityStatus('cv', 'success', cv.id));
            },
            // error
            error: () => {
              // TODO
            },
          }),
        ),
      ),
    ),
  );

  /** Updates a CV. */
  getAllTemplates = rxMethod<void>(
    pipe(
      // call api
      switchMap(() =>
        from(this.api.getAllCvTemplates()).pipe(
          // handle response
          tapResponse({
            // success
            next: (templates) => {
              patchState(
                this,
                setEntityStatus(
                  'template',
                  'success',
                  ...templates.map(({ id }) => id),
                ),
                setEntities(templates, {
                  collection: 'template',
                }),
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
  );

  patchBlock<TBlock extends Blocks>(
    cv: Cv,
    block: Partial<TBlock> & Identifiable,
  ) {
    this.update(_patchBlock(cv, block));
  }

  /** Gets a block prototype by its id. */
  getPrototype(prototypeId: UUID) {
    return this.prototypeEntityMap()[prototypeId];
  }

  /** Gets a block prototype by its id. */
  getChildPrototypes(block: Block) {
    return computed(() =>
      _getChildPrototypes(block, this.prototypeEntityMap()),
    );
  }

  reset() {
    patchState(
      this,
      { cvStatusMap: {}, templateStatusMap: {}, prototypeStatusMap: {} },
      setAllEntities([] as Cv[], { collection: 'cv' }),
      setAllEntities([] as CvTemplate[], { collection: 'template' }),
      setAllEntities([] as BlockPrototype[], { collection: 'prototype' }),
      setAllEntities([] as CvTranslation[], { collection: 'translation' }),
    );
  }

  translation(cvTemplateId: UUID, locale: string) {
    return computed(() => {
      const translation =
        this.translationEntityMap()[buildCvTranslationId(cvTemplateId, locale)];

      if (!translation) return;

      return translation.value;
    });
  }

  getTranslation = rxMethod<{ cvTemplateId: UUID; locale: string }>(
    pipe(
      map(({ locale, cvTemplateId }) => ({
        locale,
        cvTemplateId,
        id: buildCvTranslationId(cvTemplateId, locale),
      })),
      tap(({ id }) => {
        patchState(this, setEntityStatus('translation', 'loading', id));
      }),
      switchMap(({ locale, cvTemplateId, id }) =>
        from(this.api.getTranslation(cvTemplateId, locale)).pipe(
          // handle response
          tapResponse({
            // success
            next: (value) => {
              patchState(
                this,
                setEntityStatus('translation', 'success', id),
                setEntity(
                  {
                    id,
                    value,
                  },
                  {
                    collection: 'translation',
                  },
                ),
              );
            },
            // error
            error: () => {
              patchState(this, setEntityStatus('translation', 'error', id));
            },
          }),
        ),
      ),
    ),
  );
}
