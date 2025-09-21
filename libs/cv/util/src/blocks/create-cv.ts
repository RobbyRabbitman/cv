import type { UUID } from '@robby-rabbitman/cv-libs-common-types';
import type { BlockPrototype, Cv } from '@robby-rabbitman/cv-libs-cv-types';
import { createBlock } from './create-block';

/**
 * Creates a CV from a set of prototypes. The set is expected to be complete,
 * meaning it contains all (transitive) prototypes.
 */
export function createCv(
  prototypes: Record<UUID, BlockPrototype>,
  options?: { idGenerator?: () => UUID },
): Pick<Cv, 'id' | 'prototypeId' | 'type' | 'children'> {
  const { idGenerator } = options ?? {};

  const cvPrototypes = Object.values(prototypes).filter(
    ({ type }) => type === 'cv',
  );

  if (cvPrototypes.length !== 1)
    throw new Error(
      `[createCv]: need exactly 1 cv prototype, when creating a cv from a list of prototypes. Found ${cvPrototypes.length}.`,
    );

  const cv = createBlock(cvPrototypes[0] as BlockPrototype<Cv>, {
    idGenerator,
    prototypes,
  });

  return cv;
}
