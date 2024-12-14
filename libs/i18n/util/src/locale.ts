import { Injector } from '@angular/core';
import { injectWindow } from '@robby-rabbitman/cv-libs-common-util';
import { assertInjector } from 'ngxtension/assert-injector';

/** Injects the locale from the document. */
export function injectDocumentLocale(injector?: Injector) {
  injector = assertInjector(injectDocumentLocale, injector);
  return injectWindow({ injector }).navigator.language;
}

export function coerceLocale(
  locale: string,
  locales: string[],
  options: {
    weights: Partial<Record<keyof Intl.LocaleOptions, number>>;
  },
) {
  const localeParts = new Intl.Locale(locale);

  const weights = {
    language: 1, // Intl.Locale will always have a language
    ...options.weights,
  } satisfies typeof options.weights;

  let bestMatch: string | undefined;
  let bestMatchScore = -1;

  for (const candidate of locales) {
    const candidateParts = new Intl.Locale(candidate);

    let score = 0;

    for (const weight in weights) {
      if (
        localeParts[weight as keyof Intl.LocaleOptions] ===
        candidateParts[weight as keyof Intl.LocaleOptions]
      )
        score += weights[weight as keyof Intl.LocaleOptions] ?? 0;
    }

    if (score > bestMatchScore) {
      bestMatch = candidate;
      bestMatchScore = score;
    }
  }

  return bestMatch;
}
