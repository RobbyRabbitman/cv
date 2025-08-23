import type { UUID } from '@robby-rabbitman/cv-libs-common-types';
import type { Block } from '../block';

export type BlockTemplate<TBlock extends Block = Block> = Omit<
  TBlock,
  'id' | 'type' | 'prototypeId'
>;

export type BlockTemplateWithChildren<TBlock extends Block = Block> = Omit<
  TBlock,
  'children'
> & {
  childPrototypeIds: UUID[];
};
