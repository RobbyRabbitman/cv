import { Identifiable, UUID } from '@cv/common/types';

/** All block types. */
export const BLOCKS = ['cv', 'section', 'paragraph', 'field'] as const;

export type BlockType = (typeof BLOCKS)[number];

/**
 * A part of a CV.
 */
export interface Block extends Identifiable {
  /** The type of this block */
  type: BlockType;

  /** The prototype this block was made of */
  prototypeId: UUID;
}

export interface HasChildren<TChildren> {
  children: TChildren[];
}

/**
 * A CV. It is made of multiple sections and is owned by a user.
 */
export interface Cv extends Block, HasChildren<Section> {
  type: 'cv';

  /** ISO 8601 */
  createdAt: string;

  /** ISO 8601 */
  lastModifiedAt: string;

  /** The associated user id of this CV  */
  userId: UUID;
}

/**
 * A Section of a CV. It is made of multiple paragraps.
 */
export interface Section extends Block, HasChildren<Paragraph> {
  type: 'section';
}

/**
 * A paragraph in a section. It is made of multiple fields.
 */
export interface Paragraph extends Block, HasChildren<Section> {
  type: 'paragraph';
}

/**
 * A field in a paragraph.
 */
export interface Field extends Block {
  type: 'field';
}

/**
 * A field. It has a value of type `T`.
 */
export interface SimpleField<TValue> extends Field {
  /** The value of this field */
  value: TValue;
}

/**
 * A field which is a _composition_ of multiple fields.
 */
export interface CompositeField<TField extends readonly Field[] = Field[]>
  extends Field {
  /** The fields this is composed of. */
  children: TField;
}

/** A field which has a text `value`. */
export type TextField = SimpleField<string>;

/** A field which has a `value` in an integer range between `min` and `max` */
export interface RangeField extends SimpleField<number> {
  /** Lower bound of this range. */
  min: number;

  /** Upper bound of this range. */
  max: number;
}

/** A date range field. A date is represented by a iso 8601 string.  */
export interface DateRangeField extends CompositeField<[TextField, TextField]> {
  /** Whether the range end _is_ present. */
  present: boolean;
}

export interface Labeled {
  label: UUID;
}

export interface Deletable {
  /** Whether this can be deleted. */
  canBeDeleted: boolean;
}

export interface Movable {
  /** Whether this can be moved when its inside a list. */
  canBeMoved: boolean;
}

export interface BlockPrototype<TBlock extends Block = Block>
  extends Identifiable,
    Labeled,
    Deletable,
    Movable {
  /** A template for creating a block. */
  template: BlockPrototypeTemplate<
    TBlock extends HasChildren<TBlock extends HasChildren<infer C> ? C : never>
      ? BlockPrototypeTemplateWithChildren<TBlock>
      : TBlock
  >;

  /** The type of this block */
  type: TBlock extends { type: infer B } ? B : never;

  /** Whether multiple blocks can be created. */
  multiple: boolean;
}

export type BlockPrototypeTemplate<TBlock extends Block = Block> = Omit<
  TBlock,
  'id' | 'type' | 'prototypeId'
>;

export type BlockPrototypeTemplateWithChildren<TBlock extends Block = Block> =
  Omit<TBlock, 'children'> & {
    childPrototypeIds: UUID[];
  };

export function hasBlockChildren<TChild extends Block, TBlock extends Block>(
  block: TBlock | (TBlock & HasChildren<TChild>),
): block is TBlock & HasChildren<TChild> {
  return 'children' in block;
}

export function hasTemplateChildren<TBlock extends Block>(
  template:
    | BlockPrototypeTemplate<TBlock>
    | BlockPrototypeTemplateWithChildren<TBlock>,
): template is BlockPrototypeTemplateWithChildren<TBlock> {
  return 'childPrototypeIds' in template;
}
