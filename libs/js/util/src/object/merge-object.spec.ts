import { mergeObjects } from './merge-object';

describe('[Unit Test] mergeObjects', () => {
  it('should merge two objects with primitive values', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = mergeObjects(target, source);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('should merge nested objects recursively', () => {
    const target = { a: { b: 1 } };
    const source = { a: { c: 2 } };
    const result = mergeObjects(target, source);
    expect(result).toEqual({ a: { b: 1, c: 2 } });
  });

  it('should concatenate arrays', () => {
    const target = { a: [1, 2] };
    const source = { a: [3, 4] };
    const result = mergeObjects(target, source);
    expect(result).toEqual({ a: [1, 2, 3, 4] });
  });

  it('should overwrite primitive values with objects', () => {
    const target = { a: 1 };
    const source = { a: { b: 2 } };
    const result = mergeObjects(target, source);
    expect(result).toEqual({ a: { b: 2 } });
  });

  it('should handle null and undefined values', () => {
    const target = { a: 1 };
    const source = null;
    const result = mergeObjects(
      target,
      source as unknown as Record<PropertyKey, unknown>,
    );
    expect(result).toEqual({ a: 1 });

    const target2 = null;
    const source2 = { b: 2 };
    const result2 = mergeObjects(
      target2 as unknown as Record<PropertyKey, unknown>,
      source2,
    );
    expect(result2).toEqual({ b: 2 });
  });
});
