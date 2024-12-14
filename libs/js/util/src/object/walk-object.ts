import { hasObjectOwn } from './has-object-own.js';
import { isNonNullishObject } from './is-non-nullish-object.js';

export function walkObject<T = unknown>(
  object: Record<PropertyKey, unknown>,
  path: string,
) {
  const parts = path.split('.');
  const lastPart = parts.pop();

  if (!lastPart) {
    throw new Error('Path cannot be empty.');
  }

  const walkedSoFar: string[] = [];
  let currentObjectInPath = object;

  /** Walk through the object - requires that each part is a non nullish object. */
  for (const part of parts) {
    if (!hasObjectOwn(currentObjectInPath, part)) {
      throw new Error(
        `Failed to walk '${path}' - '${walkedSoFar.join('.')}' does not have property '${part}'.`,
      );
    }

    if (!isNonNullishObject(currentObjectInPath[part])) {
      throw new Error(
        `Failed to walk '${path}' - '${walkedSoFar.join('.')}.${part}' is not an object.`,
      );
    }

    walkedSoFar.push(part);
    currentObjectInPath = currentObjectInPath[part];
  }

  if (!hasObjectOwn(currentObjectInPath, lastPart)) {
    throw new Error(
      `Failed to walk '${path}' - '${walkedSoFar.join('.')}' does not have property '${lastPart}'.`,
    );
  }

  return currentObjectInPath[lastPart] as T;
}
