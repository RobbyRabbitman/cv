import { isNonNullishObject } from './is-non-nullish-object';

describe('[Unit Test] isNonNullishObject', () => {
  it('should return true for objects', () => {
    expect(isNonNullishObject({})).toBe(true);
    expect(isNonNullishObject([])).toBe(true);
    expect(isNonNullishObject(new Date())).toBe(true);
  });

  it('should return false for null', () => {
    expect(isNonNullishObject(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isNonNullishObject(undefined)).toBe(false);
  });

  it('should return false for primitives other than null or undefined', () => {
    expect(isNonNullishObject(42)).toBe(false);
    expect(isNonNullishObject('string')).toBe(false);
    expect(isNonNullishObject(true)).toBe(false);
    expect(isNonNullishObject(Symbol())).toBe(false);
  });
});
