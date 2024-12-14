import { walkObject } from './walk-object';

describe('[Unit Test] walkObject', () => {
  const someObject = {
    a: {
      b: {
        c: 42,
      },
    },
    x: {
      y: null,
    },
  };

  it('should return the correct value for a valid path', () => {
    expect(walkObject(someObject, 'a.b.c')).toBe(42);
  });

  it('should throw an error for an empty path', () => {
    expect(() => walkObject(someObject, '')).toThrow('Path cannot be empty.');
  });

  it('should throw an error for a non-existent property', () => {
    expect(() => walkObject(someObject, 'a.b.d')).toThrow(
      `Failed to walk 'a.b.d' - 'a.b' does not have property 'd'.`,
    );
  });

  it('should throw an error for a non-existent property within the path', () => {
    expect(() => walkObject(someObject, 'a.d.x')).toThrow(
      `Failed to walk 'a.d.x' - 'a' does not have property 'd'.`,
    );
  });

  it('should throw an error for a non-object property in the path', () => {
    expect(() => walkObject(someObject, 'a.b.c.d')).toThrow(
      `Failed to walk 'a.b.c.d' - 'a.b.c' is not an object.`,
    );
  });

  it('should handle paths with nullish objects correctly', () => {
    expect(() => walkObject(someObject, 'x.y.z')).toThrow(
      `Failed to walk 'x.y.z' - 'x.y' is not an object.`,
    );
  });
});
