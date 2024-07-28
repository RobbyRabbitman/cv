import { mergeObjects, objectPath } from '@cv/common/util';
import {
  isTranslation,
  isTranslationString,
  NarrowTranslationValue,
  Translation,
  TranslationParameters,
  TranslationValue,
  TranslationValueType,
} from '@cv/i18n/types';

/**
 * Translates a `key` for the given `translation`.
 *
 * - If the `key` is not found, it returns the `key`.
 * - If `translation` is not a _translation_, it returns the `key`.
 * - If the value of the `key` is a _translation_, it returns the _translation_.
 * - If the value of the `key` is a _translation string_, it returns the _translation string_.
 * - If `options.params` is provided, it replaces the placeholders in the _translation string_. E.g. `'{{ someParam }}'` is replaced with the value of the key `someParam` in `options.params`.
 * - Optionally, it asserts the return type to be a _translation_ or a _translation string_.
 */
export function translate(
  key: string,
  translation: Translation,
  options: {
    params?: TranslationParameters;
    assert?: TranslationValueType;
  },
): typeof translation extends Translation
  ? NarrowTranslationValue<typeof options.assert>
  : string {
  if (!isTranslation(translation) && !isTranslationString(translation))
    return key;

  const { assert, params } = options;

  let value: TranslationValue;

  try {
    value = objectPath<TranslationValue>(translation, key);
  } catch {
    return key;
  }

  if (isTranslation(value)) {
    if (assert && assert !== 'Translation') throw new Error(``);

    return value;
  }

  if (isTranslationString(value)) {
    if (assert && assert !== 'string') throw new Error(``);

    if (params)
      return Object.keys(params).reduce(
        (value, param) => value.replaceAll(`{{ ${param} }}`, params[param]),
        value,
      );

    return value;
  }

  throw new Error(``);
}

/**
 *  Merges the `source` translation into the `target` translation.
 *
 * - If `options.prefix` is provided, it merges the `source` translation into the `target` translation at the specified `prefix`.
 */
export function mergeTranslation(
  target: Translation,
  source: Translation,
  options?: {
    prefix?: string;
  },
) {
  target = structuredClone(target);
  source = structuredClone(source);

  if (options?.prefix) {
    const prefix = options.prefix.split('.').reverse();

    source = prefix.reduce(
      (translation, path) => ({ [path]: translation }),
      source,
    );
  }

  const mergedTranslation = mergeObjects(target, source);

  return mergedTranslation;
}
