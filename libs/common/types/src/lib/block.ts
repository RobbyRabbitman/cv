import { Identifiable } from './identifiable';

/** All block types. */
export const BLOCKS = ['CV'] as const;

export type BlockType = (typeof BLOCKS)[0];

/**
 * A part of a CV.
 */
export interface Block extends Identifiable {
  type: BlockType;
}
