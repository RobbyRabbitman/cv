import { hasObjectOwn } from './has-object-own.js';
import { isNonNullishObject } from './is-non-nullish-object.js';

/**
 * Merges two objects recursively. If a property is an array in both objects,
 * the arrays are concatenated. If a property is an object in both objects, the
 * objects are merged recursively. Otherwise, the property from the source
 * object overwrites the property in the target object.
 *
 * @param target - The target object to merge into.
 * @param source - The source object to merge from.
 * @returns The merged object.
 */
export function mergeObjects<
  TTarget extends Record<PropertyKey, unknown>,
  TSource extends Record<PropertyKey, unknown>,
>(target: TTarget, source: TSource): TTarget & TSource {
  if (target == null) return source as TTarget & TSource;
  if (source == null) return target as TTarget & TSource;

  Object.keys(source).forEach((sourceKey) => {
    if (!hasObjectOwn(source, sourceKey)) return;

    const sourceValue = source[sourceKey];
    const targetValue = hasObjectOwn(target, sourceKey)
      ? target[sourceKey]
      : undefined;

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      Object.assign(target, {
        [sourceKey]: targetValue.concat(...sourceValue),
      });
    } else if (
      isNonNullishObject(targetValue) &&
      isNonNullishObject(sourceValue)
    ) {
      Object.assign(target, {
        [sourceKey]: mergeObjects(targetValue, sourceValue),
      });
    } else {
      Object.assign(target, { [sourceKey]: sourceValue });
    }
  });

  return target as TTarget & TSource;
}
