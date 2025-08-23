import type { UUID } from '@robby-rabbitman/cv-libs-common-types';
import type { Block } from './block';
import type { HasChildren } from './modifier/has-children';
import type { Labeled } from './modifier/labeled';
import type { Section } from './section';

/** A CV. It is made of multiple sections and is owned by a user. */
export interface Cv extends Block, Partial<Labeled>, HasChildren<Section> {
  type: 'cv';

  createdAt: number;

  lastModifiedAt: number;

  /** The associated user id of this CV */
  userId: UUID;
}
