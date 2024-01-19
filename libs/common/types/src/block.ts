import { Identifiable, UUID } from './identifiable';

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

export interface HasChildren<T> {
  children: T[];
}

/**
 * A CV. It is made of multiple sections and is owned by a user.
 */
export interface Cv extends Block, HasChildren<Section> {
  type: 'cv';

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
export interface Field extends Block, Deletable {
  type: 'field';
}

/**
 * A field. It has a value of type `T`.
 */
export interface SimpleField<T> extends Field {
  /** The value of this field */
  value: T;
}

/**
 * A field which is a _composition_ of multiple fields.
 */
export interface CompositeField<F extends readonly Field[] = Field[]>
  extends Field {
  /** The fields this is composed of. */
  children: F;
}

/** A field which has a text `value`. */
export type TextField = SimpleField<string>;

/** A slider which has a `value` in an integer range between `min` and `max` */
export interface SliderField extends SimpleField<number> {
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

export interface BlockPrototype<T extends Block>
  extends Labeled,
    Deletable,
    Movable {
  /** A template for creating a block. */
  template: Omit<
    T extends HasChildren<unknown>
      ? Omit<T, 'children'> & { childPrototypeIds: UUID[] }
      : T,
    'id'
  >;

  /** Whether multiple blocks can be created. */
  multiple: boolean;
}
