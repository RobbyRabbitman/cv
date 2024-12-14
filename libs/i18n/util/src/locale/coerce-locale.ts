import type { Locale } from '@robby-rabbitman/cv-libs-i18n-types';

export interface CoerceLocaleOptions {
  /** The locale to coerce. */
  locale: Locale;

  /**
   * The list of candidates to compare the `locale` against - eventually
   * returning the best match.
   */
  candidates: Locale[];

  /**
   * The locale to fallback to when the `locale` cannot be coerced to one of the
   * `candidates`.
   */
  fallback?: Locale;

  /**
   * Whether the `locale` can be coerced to one of the `candidates`.
   *
   * - If `true`, an error is thrown when no match is found.
   * - If `false`, `undefined` is returned when no match is found.
   */
  requireMatch?: boolean;

  /**
   * The weights to apply to the comparison of the `locale` against the
   * `candidates`.
   */
  weights?: Partial<Record<keyof Intl.LocaleOptions, number>>;
}

/**
 * Coerces a locale from a list of candidate locales based on specified weights.
 *
 * - This is useful when an application has a fixed set of supported locales which
 *   may not include the users.
 *
 * ```ts
 * const locale = coerceLocale({
 *   locale: 'en-US',
 *   candidates: ['en', 'de'],
 *   weights: {
 *     // only the language is considered
 *     language: 1,
 *   },
 * });
 *
 * console.log(locale); // 'en'
 * ```
 */
export function coerceLocale(options: CoerceLocaleOptions) {
  const defaultOptions = {
    requireMatch: true,
    weights: {
      /** Intl.Locale always has a language because of the bcp47 spec. */
      language: 1,
    },
  } satisfies Partial<CoerceLocaleOptions>;

  const normalizedOptions = {
    ...defaultOptions,
    ...options,
    weights: {
      ...defaultOptions.weights,
      ...options.weights,
    },
  };

  const { locale, candidates, weights, requireMatch, fallback } =
    normalizedOptions;

  const localeParts = new Intl.Locale(locale);

  let bestCandidate: Locale | undefined;
  let scoreOfBestCandidate = -1;

  for (const currentCandidate of candidates) {
    const localePartsOfCurrentCandidate = new Intl.Locale(currentCandidate);

    let scoreOfCurrentCandidate = 0;

    for (const weight in weights) {
      if (
        localeParts[weight as keyof Intl.LocaleOptions] ===
        localePartsOfCurrentCandidate[weight as keyof Intl.LocaleOptions]
      )
        scoreOfCurrentCandidate +=
          weights[weight as keyof Intl.LocaleOptions] ?? 0;
    }

    if (scoreOfCurrentCandidate > scoreOfBestCandidate) {
      bestCandidate = currentCandidate;
      scoreOfBestCandidate = scoreOfCurrentCandidate;
    }
  }

  if (bestCandidate) {
    return bestCandidate;
  }

  if (fallback) {
    return fallback;
  }

  if (requireMatch) {
    throw new Error(
      `Could not coerce locale '${locale}' to one of the candidates: ${candidates}. You may adjust the weights or the candidates.`,
    );
  }

  return null;
}
