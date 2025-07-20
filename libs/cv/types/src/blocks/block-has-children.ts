import type { Block } from './block';
import type { HasChildren } from './modifier/has-children';

export function blockHasChildren<TChild extends Block, TBlock extends Block>(
  block?: TBlock | (TBlock & HasChildren<TChild>),
): block is TBlock & HasChildren<TChild> {
  return block != null && 'children' in block;
}
