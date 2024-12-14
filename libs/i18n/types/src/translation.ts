// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface Translation {
  [key: string]: TranslationValue;
}

export type TranslationValue = string | Translation;

export type TranslationValueType = 'string' | 'Translation';

export type NarrowTranslationValue<T extends TranslationValueType | undefined> =
  T extends 'string'
    ? string
    : T extends 'Translation'
      ? Translation
      : TranslationValue;

export type TranslationParameters = Record<string, string>;

export function isTranslationString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isTranslation(value: unknown): value is Translation {
  return value != null && typeof value === 'object';
}
