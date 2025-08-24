import type { Paragraph, TextField } from '@robby-rabbitman/cv-libs-cv-types';
import {
  MOCK_BLOCK_PROTOTYPES,
  MOCK_BLOCKS,
} from '@robby-rabbitman/cv-libs-cv-types/testing';
import { createBlock } from './create-block';

describe('createBlock', () => {
  const idMatch = jasmine.stringMatching(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  ) as unknown as string;

  it('should create a block', () => {
    expect(
      createBlock<TextField>(MOCK_BLOCK_PROTOTYPES.textFieldPrototype),
    ).toEqual({
      ...MOCK_BLOCKS.textField,
      id: idMatch,
    });
  });

  it('should create a block with children', () => {
    expect(
      createBlock<Paragraph>(MOCK_BLOCK_PROTOTYPES.paragraphPrototype, {
        prototypes: MOCK_BLOCK_PROTOTYPES,
      }),
    ).toEqual({
      ...MOCK_BLOCKS.paragraph,
      id: idMatch,
      children: MOCK_BLOCKS.paragraph.children.map((child) => ({
        ...child,
        id: idMatch,
      })),
    });
  });

  it('should throw when the set of prototypes is not complete', () => {
    expect(() =>
      createBlock<Paragraph>(MOCK_BLOCK_PROTOTYPES.paragraphPrototype),
    ).toThrowError(
      '[createBlock]: Could not create a new child block, because prototype textFieldPrototype is missing.',
    );
  });

  xit('should catch circular dependencies in prototypes', () => {
    // TODO
  });
});
