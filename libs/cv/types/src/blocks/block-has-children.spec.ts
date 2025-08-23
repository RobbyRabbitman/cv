import { MOCK_BLOCKS } from '../testing';
import { blockHasChildren } from './block-has-children';

describe('blockHasChildren', () => {
  it('should return true for blocks with children', () => {
    expect(blockHasChildren(MOCK_BLOCKS.cv)).toBe(true);
  });

  it('should return false for blocks without children', () => {
    expect(blockHasChildren(MOCK_BLOCKS.textField)).toBe(false);
  });

  it('should return false for undefined blocks', () => {
    expect(blockHasChildren(undefined)).toBe(false);
  });
});
