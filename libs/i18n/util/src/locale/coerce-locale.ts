import type { Locale } from '@robby-rabbitman/cv-libs-i18n-types';

export interface CoerceLocaleOptions {
  locale: Locale;
  candidates: Locale[];
  fallback?: Locale;
  requireMatch?: boolean;
  weights?: Partial<Record<keyof Intl.LocaleOptions, number>>;
}

export function coerceLocale(
  options:
    | (Omit<CoerceLocaleOptions, 'requireMatch'> & { requireMatch: true })
    | (Omit<CoerceLocaleOptions, 'fallback'> & { fallback: Locale }),
): Locale;
export function coerceLocale(options: CoerceLocaleOptions): Locale | null;

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
      language: 1, // Intl.Locale always has a language because of the BCP 47 spec.
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

    let scoreOfCurrentCandidate = -1;

    for (const weightKey in weights) {
      if (
        localeParts[weightKey as keyof typeof weights] ===
        localePartsOfCurrentCandidate[weightKey as keyof typeof weights]
      ) {
        scoreOfCurrentCandidate += (weights as Required<typeof weights>)[
          weightKey as keyof typeof weights
        ];
      }
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
      `Could not coerce locale '${locale}' to one of the candidates: ${candidates.join(', ')}. You may adjust the weights or the candidates.`,
    );
  }

  return null;
}
