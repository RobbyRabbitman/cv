import { signalStore, type } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import {
  type BlockPrototype,
  type Cv,
  type CvTemplate,
} from '@robby-rabbitman/cv-libs-cv-types';

export const CvStore = signalStore(
  withEntities({ entity: type<Cv>(), collection: 'cv' }),
  withEntities({
    entity: type<CvTemplate>(),
    collection: 'template',
  }),
  withEntities({ entity: type<BlockPrototype>(), collection: 'prototype' }),
);
