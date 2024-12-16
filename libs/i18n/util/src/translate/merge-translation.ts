import type { Translation } from '@robby-rabbitman/cv-libs-i18n-types';
import { mergeObjects } from '@robby-rabbitman/cv-libs-js-util';

/**
 * Merges the `source` translation into the `target` translation.
 *
 * - If `options.prefix` is provided, it merges the `source` translation into the
 *   `target` translation at the specified `prefix`.
 */
export function mergeTranslation(options: {
  target: Translation;
  source: Translation;
  prefix?: string;
}) {
  const { prefix } = options;

  const target = structuredClone(options.target);
  let source = structuredClone(options.source);

  if (prefix) {
    source = prefix
      .split('.')
      .reduceRight((translation, path) => ({ [path]: translation }), source);
  }

  const mergedTranslation = mergeObjects(target, source);

  return mergedTranslation;
}
