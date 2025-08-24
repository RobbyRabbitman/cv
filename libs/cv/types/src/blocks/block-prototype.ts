import type { Identifiable, UUID } from '@robby-rabbitman/cv-libs-common-types';
import type { Block } from './block';
import type { Deletable } from './modifier/deletable';
import type { HasChildren } from './modifier/has-children';
import type { Labeled } from './modifier/labeled';
import type { Movable } from './modifier/movable';
import type {
  BlockTemplate,
  BlockTemplateWithChildren,
} from './template/block-template';

/** A prototype for creating blocks in a CV. */
export interface BlockPrototype<
  TBlock extends Block = Block,
  TBlockTemplate extends BlockTemplate = BlockTemplate<
    TBlock extends HasChildren<TBlock extends HasChildren<infer C> ? C : never>
      ? BlockTemplateWithChildren<TBlock>
      : TBlock
  >,
> extends Identifiable,
    Labeled,
    Deletable,
    Movable {
  /** A template for creating a block. */
  template: TBlockTemplate;

  /** The cv template this block prototype is associated with. */
  cvTemplateId: UUID;

  /** The type of this block */
  type: TBlock extends { type: infer B } ? B : never;

  /** Whether multiple blocks can be created. */
  multiple: boolean;
}
