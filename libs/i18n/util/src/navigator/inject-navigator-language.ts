import type { Injector } from '@angular/core';
import { injectWindow } from '@robby-rabbitman/cv-libs-common-util';
import { assertInjector } from 'ngxtension/assert-injector';

interface InjectNavigatorLanguageOptions {
  injector?: Injector;
  assertBCP47tag?: boolean;
}

export function injectNavigatorLanguage(options: {
  injector?: Injector;
  assertBCP47tag: true;
}): Intl.UnicodeBCP47LocaleIdentifier;
export function injectNavigatorLanguage(options: {
  injector?: Injector;
  assertBCP47tag?: false;
}): string;
export function injectNavigatorLanguage(
  options: InjectNavigatorLanguageOptions,
): string | Intl.UnicodeBCP47LocaleIdentifier;

/**
 * Injects the `navigator.language` from the `window` object.
 *
 * - Can be used for the `Intl` namespace -
 *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl}
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language}
 * @see {@link injectWindow}
 */
export function injectNavigatorLanguage(
  options: InjectNavigatorLanguageOptions,
) {
  const defaultOptions = {
    assertBCP47tag: true,
  } satisfies InjectNavigatorLanguageOptions;

  const { injector, assertBCP47tag } = {
    ...defaultOptions,
    ...options,
  };

  return assertInjector(injectNavigatorLanguage, injector, () => {
    const navigatorLanguage = injectWindow().navigator.language;

    if (!assertBCP47tag) {
      return navigatorLanguage;
    }

    if (Intl.getCanonicalLocales(navigatorLanguage).length === 0) {
      throw new Error(
        `Navigator language '${navigatorLanguage}' is not a valid BCP 47 tag.`,
      );
    }

    return navigatorLanguage as Intl.UnicodeBCP47LocaleIdentifier;
  });
}
