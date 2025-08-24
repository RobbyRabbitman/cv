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
 *
 * TODO: check for circular dependencies in prototypes.
 */
export function createBlock<TBlock extends Block>(
  prototype: BlockPrototype<TBlock>,
  options?: {
    prototypes?: Record<UUID, BlockPrototype>;
    idGenerator?: () => UUID;
  },
): TBlock {
  const { idGenerator, prototypes } = {
    idGenerator: uuid,
    prototypes: {},
    ...options,
  };

  const buildLeaf = (prototype: BlockPrototype<TBlock>) => {
    if (hasTemplateChildren(prototype.template)) {
      throw new Error(
        `[createBlock]: expected a block prototype without children.`,
      );
    }

    return Object.assign(
      {
        prototypeId: prototype.id,
        type: prototype.type,
        id: idGenerator(),
      } satisfies Block,
      prototype.template as unknown as TBlock,
    );
  };

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

    return buildLeaf({
      children,
      ...template,
    } as unknown as BlockPrototype<TBlock>);
  } else {
    return buildLeaf(prototype);
  }
}
