import {
  isTranslation,
  isTranslationString,
  type NarrowTranslationValue,
  type Translation,
  type TranslationParameters,
  type TranslationValue,
  type TranslationValueType,
} from '@robby-rabbitman/cv-libs-i18n-types';
import { walkObject } from '@robby-rabbitman/cv-libs-js-util';

/**
 * Translates a `key` for the given `translation`.
 *
 * - If the `key` is not found, it returns the `key`.
 * - If `translation` is not a _translation_, it returns the `key`.
 * - If the value of the `key` is a _translation_, it returns the _translation_.
 * - If the value of the `key` is a _translation string_, it returns the
 *   _translation string_.
 * - If `options.params` is provided, it replaces the placeholders in the
 *   _translation string_. E.g. `'{{ someParam }}'` is replaced with the value
 *   of the key `someParam` in `options.params`.
 * - Optionally, it asserts the return type to be a _translation_ or a
 *   _translation string_.
 */
export function translate(options: {
  key: string;
  translation: Translation;
  params?: TranslationParameters;
  assert?: TranslationValueType;
}): typeof options.translation extends Translation
  ? NarrowTranslationValue<typeof options.assert>
  : string {
  const { key, translation, assert, params } = options;

  if (!isTranslation(translation)) {
    return key;
  }

  let value: TranslationValue;

  try {
    value = walkObject<TranslationValue>(translation, key);
  } catch {
    return key;
  }

  if (isTranslation(value)) {
    if (assert && assert !== 'Translation') {
      throw new Error(
        `Expected a '${assert}' for key '${key}' but got a 'Translation'.`,
      );
    }

    return value;
  }

  if (isTranslationString(value)) {
    if (assert && assert !== 'string') {
      throw new Error(
        `Expected a '${assert}' for key '${key}' but got a 'Translation String'.`,
      );
    }

    if (params) {
      return Object.keys(params).reduce((value, param) => {
        return value.replaceAll(`{{ ${param} }}`, String(params[param]));
      }, value);
    }

    return value;
  }

  throw new Error(
    `Expected a 'Translation' or a 'Translation String' - provided: ${value}`,
  );
}
