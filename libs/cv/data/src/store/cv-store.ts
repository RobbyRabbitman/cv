import { signalStore, type, withLinkedState, withState } from '@ngrx/signals';
import { entityConfig, withEntities } from '@ngrx/signals/entities';
import type { UUID } from '@robby-rabbitman/cv-libs-common-types';
import {
  type BlockPrototype,
  type Cv,
  type CvTemplate,
} from '@robby-rabbitman/cv-libs-cv-types';

interface CvState {
  _activeId: UUID | null | undefined;
}

const CvEntity = entityConfig({
  entity: type<Cv>(),
  collection: '_cv',
  selectId: (cv) => cv.id,
});

const TemplateEntity = entityConfig({
  entity: type<CvTemplate>(),
  collection: '_template',
  selectId: (template) => template.id,
});

const PrototypeEntity = entityConfig({
  entity: type<BlockPrototype>(),
  collection: '_prototype',
  selectId: (prototype) => prototype.id,
});

export const CvStore = signalStore(
  withState<CvState>({ _activeId: undefined }),
  withEntities(CvEntity),
  withEntities(TemplateEntity),
  withEntities(PrototypeEntity),
  withLinkedState(({ _activeId, _cvEntityMap }) => ({
    active: () => {
      const activeId = _activeId();

      if (!activeId) {
        return null;
      }

      const cvs = _cvEntityMap();

      return cvs[activeId];
    },
  })),
);
