import type { Translation } from '@robby-rabbitman/cv-libs-i18n-types';
import { mergeTranslation } from './merge-translation';

describe('[Unit Test] mergeTranslation', () => {
  it('should merge source into target', () => {
    const target: Translation = { a: 'A' };
    const source: Translation = { b: 'B' };
    const result = mergeTranslation({ target, source });
    expect(result).toEqual({ a: 'A', b: 'B' });
  });

  it('should merge source into target with prefix', () => {
    const target: Translation = { a: 'A' };
    const source: Translation = { b: 'B' };
    const result = mergeTranslation({ target, source, prefix: 'nested' });
    expect(result).toEqual({ a: 'A', nested: { b: 'B' } });
  });

  it('should overwrite target properties with source properties', () => {
    const target: Translation = { a: 'A', b: 'Old B' };
    const source: Translation = { b: 'New B' };
    const result = mergeTranslation({ target, source });
    expect(result).toEqual({ a: 'A', b: 'New B' });
  });

  it('should handle empty target and source', () => {
    const target: Translation = {};
    const source: Translation = {};
    const result = mergeTranslation({ target, source });
    expect(result).toEqual({});
  });

  it('should handle nested prefixes', () => {
    const target: Translation = { a: 'A' };
    const source: Translation = { b: 'B' };
    const result = mergeTranslation({ target, source, prefix: 'nested.deep' });
    expect(result).toEqual({ a: 'A', nested: { deep: { b: 'B' } } });
  });

  it('should handle nested prefixes with existing target', () => {
    const target: Translation = { a: 'A', nested: { c: 'C' } };
    const source: Translation = { b: 'B' };
    const result = mergeTranslation({ target, source, prefix: 'nested.deep' });
    expect(result).toEqual({ a: 'A', nested: { c: 'C', deep: { b: 'B' } } });
  });

  it('should deep merge', () => {
    const target: Translation = { a: { b: 'B' } };
    const source: Translation = { a: { c: 'C' } };
    const result = mergeTranslation({ target, source });
    expect(result).toEqual({ a: { b: 'B', c: 'C' } });
  });
});
