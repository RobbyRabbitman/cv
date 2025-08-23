import type { Block } from './block';
import type { HasChildren } from './modifier/has-children';
import type { Labeled } from './modifier/labeled';
import type { Paragraph } from './paragraph';

/** A Section of a CV. It is made of multiple paragraps. */
export interface Section
  extends Block,
    HasChildren<Paragraph>,
    Partial<Labeled> {
  type: 'section';
}
