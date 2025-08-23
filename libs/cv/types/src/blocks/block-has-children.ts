import type { Block } from './block';
import type { HasChildren } from './modifier/has-children';

/**
 * A type guard to check if a block has children. Does not check if there are
 * actually any children, only that the `children` property exists from a type
 * perspective.
 */
export function blockHasChildren<TChild extends Block, TBlock extends Block>(
  block?: TBlock | (TBlock & HasChildren<TChild>),
): block is TBlock & HasChildren<TChild> {
  return block != null && 'children' in block;
}
