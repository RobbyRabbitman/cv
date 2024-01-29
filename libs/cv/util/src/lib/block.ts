import { Identifiable, UUID } from '@cv/common/types';
import { uuid } from '@cv/common/util';
import {
  Block,
  BlockPrototype,
  BlockPrototypeTemplate,
  Blocks,
  Cv,
  HasChildren,
  hasBlockChildren,
  hasTemplateChildren,
} from '@cv/types';

export function createCv(
  prototypes: Record<UUID, BlockPrototype>,
  idFactory: () => UUID = uuid,
): Cv {
  const cvPrototypes = Object.values(prototypes).filter(
    ({ type }) => type === 'cv',
  );

  if (cvPrototypes.length !== 1)
    throw new Error(
      `[Block]: need exactly 1 cv prototype. Found '${cvPrototypes.length}'.`,
    );

  return createBlock(
    cvPrototypes[0] as BlockPrototype<Cv>,
    prototypes,
    idFactory,
  );
}

export function getChildPrototypes<
  TChild extends Block,
  TBlock extends Block & HasChildren<TChild>,
>(
  block: TBlock,
  prototypes: Record<UUID, BlockPrototype> = {},
): BlockPrototype<TChild>[] {
  const prototype = prototypes[block.prototypeId];

  if (!hasTemplateChildren(prototype?.template)) return [];

  return prototype.template.childPrototypeIds.map((id) => {
    const prototype = prototypes[id] as BlockPrototype<TChild>;
    if (!prototype)
      throw new Error(
        `[Block]: Could not get child prototypes of '${block.id}'. Prototype '${id}' is missing in '${Object.keys(prototypes)}'`,
      );
    return prototype;
  });
}

// TODO check for loops.
/** Creates a block by its prototype. When it has children, those prototypes have to be provided aswell. */
export function createBlock<TBlock extends Block>(
  prototype: BlockPrototype<TBlock>,
  prototypes: Record<UUID, BlockPrototype> = {},
  idFactory: () => UUID = uuid,
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
      children.push(createBlock(childPrototype, prototypes, idFactory));
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
