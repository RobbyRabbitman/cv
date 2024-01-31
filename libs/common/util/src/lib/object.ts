export function hasOwn<TObject extends object, TProperty extends PropertyKey>(
  object: TObject | undefined,
  prop: TProperty,
): object is TObject & Record<TProperty, unknown> {
  return object != null && Object.hasOwn(object, prop);
}

export function isObject(object: unknown): object is object {
  return typeof object === 'object';
}

export function objectPath<T = unknown>(object: object, path: string) {
  return path.split('.').reduce((object, prop) => {
    if (!hasOwn(object, prop))
      throw new Error(`[Common Util]: Could not resolve '${path}'.`);
    return object[prop] as object;
  }, object) as T;
}

export function mergeObjects<TTarget extends object, TSource extends object>(
  target: TTarget,
  source: TSource,
): TTarget & TSource {
  if (target == null) return source as TTarget & TSource;
  if (source == null) return target as TTarget & TSource;

  Object.keys(source).forEach((key) => {
    if (!hasOwn(source, key)) return;

    const nextValue = source[key];
    const prevValue = hasOwn(target, key) ? target[key] : undefined;

    if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
      Object.assign(target, { [key]: prevValue.concat(...nextValue) });
    } else if (isObject(prevValue) && isObject(nextValue)) {
      Object.assign(target, { [key]: mergeObjects(prevValue, nextValue) });
    } else {
      Object.assign(target, { [key]: nextValue });
    }
  });

  return target as TTarget & TSource;
}
