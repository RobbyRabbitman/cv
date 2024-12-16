import { hasObjectOwn } from './has-object-own';

describe('[Unit Test] hasOwn', () => {
  beforeEach(() => {
    vi.spyOn(Object, 'hasOwn');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should delegate to Object.hasOwn', () => {
    hasObjectOwn({ a: 123 }, 'a');
    expect(Object.hasOwn).toHaveBeenCalledWith({ a: 123 }, 'a');
  });

  it('should return false for null', () => {
    expect(hasObjectOwn(null, 'a')).toBe(false);
    expect(Object.hasOwn).not.toHaveBeenCalled();
  });

  it('should return false for undefined', () => {
    expect(hasObjectOwn(undefined, 'a')).toBe(false);
    expect(Object.hasOwn).not.toHaveBeenCalled();
  });
});
