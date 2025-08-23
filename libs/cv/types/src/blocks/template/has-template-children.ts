import type { Block } from '../block';
import type {
  BlockTemplate,
  BlockTemplateWithChildren,
} from './block-template';

export function hasTemplateChildren<TBlock extends Block>(
  template?: BlockTemplate<TBlock> | BlockTemplateWithChildren<TBlock>,
): template is BlockTemplateWithChildren<TBlock> {
  return template != null && 'childPrototypeIds' in template;
}
