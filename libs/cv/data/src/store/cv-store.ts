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
// eslint-disable-next-line @nx/enforce-module-boundaries -- TODO: make util
import { Translate } from '@robby-rabbitman/cv-libs-i18n-features-translation';
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

      store._all.reload();

      return id;
    };

    return {
      create,
      setActiveCv,
    };
  }),
);
