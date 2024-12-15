import { type EntityStatusMap, patchEntityStatus } from './entity-status';

describe('[Unit Test] patchEntityStatus', () => {
  it('should update the status of existing keys', () => {
    const someStatusMap = {
      a: 'loading',
      b: 'success',
    } satisfies EntityStatusMap;

    expect(patchEntityStatus(someStatusMap, 'error', 'a')).toEqual({
      a: 'error',
      b: 'success',
    });
  });

  it('should add new keys with the specified status', () => {
    const someStatusMap = {
      a: 'loading',
    } satisfies EntityStatusMap;

    expect(patchEntityStatus(someStatusMap, 'success', 'b')).toEqual({
      a: 'loading',
      b: 'success',
    });
  });

  it('should handle multiple keys', () => {
    const someStatusMap = { a: 'loading' } satisfies EntityStatusMap;

    expect(patchEntityStatus(someStatusMap, 'error', 'a', 'b', 'c')).toEqual({
      a: 'error',
      b: 'error',
      c: 'error',
    });
  });

  it('should not modify the original map', () => {
    const someStatusMap = { a: 'loading' } satisfies EntityStatusMap;

    const patchedEntityStatusMap = patchEntityStatus(
      someStatusMap,
      'success',
      'a',
    );

    expect(someStatusMap).toEqual({ a: 'loading' });
    expect(patchedEntityStatusMap).toEqual({ a: 'success' });
    expect(patchedEntityStatusMap).not.toBe(someStatusMap);
  });
});
