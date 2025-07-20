import {
  type Identifiable,
  type UUID,
} from '@robby-rabbitman/cv-libs-common-types';
import type { Cv } from './cv';
import type { RangeField, TextField } from './field';
import type { Paragraph } from './paragraph';
import type { Section } from './section';

/** The types of blocks that a CV is made of. */
export const BLOCKS = [
  'cv',
  'section',
  'paragraph',
  'composite',
  'text',
  'range',
  'period',
] as const;

/** The type of a block in a CV. */
export type BlockType = (typeof BLOCKS)[number];

export type Blocks = Cv | Section | Paragraph | TextField | RangeField;

/** A part of a CV. */
export interface Block extends Identifiable {
  /** The type of this block */
  type: BlockType;

  /** The prototype this block was made of */
  prototypeId: UUID;
}
