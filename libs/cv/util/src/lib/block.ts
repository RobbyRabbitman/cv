import { UUID } from '@cv/common/types';
import {
  Block,
  BlockPrototype,
  BlockPrototypeTemplate,
  SimpleField,
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

/**
 *
 * @param field
 * @param value
 * @returns a shallow copy of the field with the new value.
 */
export function setValueOfSimpleField<T>(
  field: SimpleField<T>,
  value: T,
): SimpleField<T> {
  return { ...field, value };
}
