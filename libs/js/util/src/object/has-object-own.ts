import { isNonNullishObject } from './is-non-nullish-object.js';

/**
 * Type guard version of {@link Object.hasOwn} and does not throw when `object`
 * is `null` or `undefined` but rather returns `false`.
 */
export function hasObjectOwn<
  TObject extends Record<PropertyKey, unknown>,
  TProperty extends keyof TObject,
>(
  object: TObject | null | undefined,
  prop: TProperty,
): object is TObject & Record<TProperty, TObject[TProperty]> {
  return isNonNullishObject(object) && Object.hasOwn(object, prop);
}
