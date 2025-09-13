import type { UUID } from '@robby-rabbitman/cv-libs-common-types';
import { uuid } from '@robby-rabbitman/cv-libs-common-util';
import {
  type Block,
  type BlockPrototype,
  hasTemplateChildren,
} from '@robby-rabbitman/cv-libs-cv-types';

/**
 * Creates a block from its prototype. When it has children, those prototypes
 * have to be provided aswell - the set is expected to be complete, meaning it
 * contains all (transitive) prototypes.
 */
export function createBlock<TBlock extends Block>(
  prototype: BlockPrototype<TBlock>,
  options?: {
    prototypes?: Record<UUID, BlockPrototype>;
    idGenerator?: () => UUID;
  },
): TBlock {
  const { idGenerator = uuid, prototypes = {} } = options ?? {};

  const blockBase = {
    prototypeId: prototype.id,
    type: prototype.type,
    id: idGenerator(),
  } satisfies Block;

  if (hasTemplateChildren(prototype.template)) {
    const children: Block[] = [];

    const { childPrototypeIds, ...template } = prototype.template;

    for (const childPrototypeUuid of childPrototypeIds) {
      const childPrototype = prototypes[childPrototypeUuid];

      if (!childPrototype) {
        throw new Error(
          `[createBlock]: Could not create a new child block, because prototype ${childPrototypeUuid} is missing.`,
        );
      }

      children.push(
        createBlock(childPrototype, {
          idGenerator,
          prototypes,
        }),
      );
    }

    return Object.assign(blockBase, template as unknown as TBlock, {
      children,
    });
  } else {
    return Object.assign(blockBase, prototype.template as unknown as TBlock);
  }
}
