import { inject, resource } from '@angular/core';

import {
  patchState,
  signalStore,
  withLinkedState,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import type { UUID } from '@robby-rabbitman/cv-libs-common-types';
import { uuid } from '@robby-rabbitman/cv-libs-common-util';
import { Translate } from '@robby-rabbitman/cv-libs-i18n-translation';
import { CvApi } from '../api/cv-api';

interface CvState {
  _activeId: UUID | null | undefined;
}

export const CvStore = signalStore(
  withState<CvState>({ _activeId: undefined }),
  withProps((store) => {
    const cvApi = inject(CvApi);

    return {
      _activeCv: resource({
        params: store._activeId,
        loader: async ({ params: cvId }) => {
          if (!cvId) {
            return;
          }

          return cvApi.getCv(cvId);
        },
      }),
      _all: resource({
        defaultValue: [],
        loader: async () => cvApi.getAllCvs(),
      }),
      _allTemplates: resource({
        defaultValue: [],
        loader: async () => cvApi.getAllCvTemplates(),
      }),
    };
  }),
  withProps(({ _activeCv, _allTemplates, _all }) => ({
    active: _activeCv.asReadonly(),
    allTemplates: _allTemplates.asReadonly(),
    all: _all.asReadonly(),
  })),
  withLinkedState(({ allTemplates }) => {
    const defaultTemplate = () => {
      if (!allTemplates.hasValue()) {
        return;
      }

      return allTemplates.value()[0];
    };

    const ready = () => !allTemplates.isLoading() && defaultTemplate() != null;

    return {
      defaultTemplate,
      ready,
    };
  }),
  withMethods((store) => {
    const cvApi = inject(CvApi);
    const translate = inject(Translate);

    /** Sets the active CV. */
    const setActiveCv = (cvId: UUID | null) => {
      patchState(store, { _activeId: cvId });
    };

    /**
     * Creates a new CV based on the given template and optionally sets it as
     * the active CV.
     *
     * @returns The id of the newly created CV.
     */
    const create = async (templateId: UUID, activate = true) => {
      const id = uuid();

      await cvApi.createCv({
        templateId,
        id,
        label: translate.instant('cv.new_document.name'),
      });

      if (activate) {
        setActiveCv(id);
      }

      /**
       * TODO: do we need to call api or can we just update the state
       * client-side?
       */
      store._all.reload();

      return id;
    };

    const deleteCv = async (cvId: UUID) => {
      await cvApi.deleteCv(cvId);

      /**
       * TODO: do we need to call api or can we just update the state
       * client-side?
       */
      store._all.reload();
    };

    return {
      create,
      setActiveCv,
      delete: deleteCv,
    };
  }),
);
