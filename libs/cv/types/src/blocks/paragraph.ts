import type { Block } from './block';
import type { Field } from './field';
import type { HasChildren } from './modifier/has-children';

/** A paragraph in a section. It is made of multiple fields. */
export interface Paragraph extends Block, HasChildren<Field> {
  type: 'paragraph';
}
