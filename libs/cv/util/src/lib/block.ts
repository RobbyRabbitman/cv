import { Identifiable, UUID } from '@cv/common/types';
import {
  Block,
  BlockPrototype,
  BlockPrototypeTemplate,
  Blocks,
  hasBlockChildren,
  hasTemplateChildren,
} from '@cv/types';

// TODO check for loops.
/** Creates a block by its prototype. When it has children, those prototypes have to be provided aswell. */
export function createBlock<TBlock extends Block>(
  prototype: BlockPrototype<TBlock>,
  idFactory: () => UUID,
  prototypes: Record<UUID, BlockPrototype> = {},
): TBlock {
  const build = (template: BlockPrototypeTemplate<TBlock>): TBlock =>
    ({
      ...template,
      prototypeId: prototype.id,
      type: prototype.type,
      id: idFactory(),
    }) as TBlock;

  if (hasTemplateChildren(prototype.template)) {
    const children: Block[] = [];

    const { childPrototypeIds, ...template } = prototype.template;

    for (const childPrototypeUuid of childPrototypeIds) {
      const childPrototype = prototypes[childPrototypeUuid];
      if (!childPrototype)
        throw new Error(
          `[Block]: Could not create a new child block. Prototype ${childPrototypeUuid} is missing.`,
        );
      children.push(createBlock(childPrototype, idFactory, prototypes));
    }

    return build({
      children,
      ...template,
    } as unknown as BlockPrototypeTemplate<TBlock>);
  }

  return build(prototype.template as BlockPrototypeTemplate<TBlock>);
}

export function patchBlock<TRoot extends Block, TBlock extends Blocks>(
  root: TRoot,
  value: Partial<TBlock> & Identifiable,
): TRoot {
  root = structuredClone(root);

  const target = findBlock(root, value.id);

  if (!target) throw new Error(`[Block]: '${value.id}' not in ${root.id}.`);

  Object.assign(target, value);

  return root;
}

export function findBlock(root: Block, id: UUID): Block | null {
  if (root.id === id) return root;

  if (hasBlockChildren(root)) {
    for (const child of root.children) {
      if (child.id === id) {
        return child;
      }
      const block = findBlock(child, id);
      if (block) return block;
    }
  }

  return null;
}
