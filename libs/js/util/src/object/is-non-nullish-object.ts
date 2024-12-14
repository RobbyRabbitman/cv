/**
 * Checks if the given value is an object that is not `null` or `undefined` -
 * note that `typeof null` is `'object'`.
 */
export function isNonNullishObject(
  object: unknown,
): object is Record<PropertyKey, unknown> {
  return object != null && typeof object === 'object';
}
