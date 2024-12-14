import type { Injector } from '@angular/core';
import { injectWindow } from '@robby-rabbitman/cv-libs-common-util';
import { assertInjector } from 'ngxtension/assert-injector';

export interface InjectNavigatorLanguageOptions {
  injector?: Injector;

  /** Whether to assert that the `navigator.language` is a valid BCP 47 tag. */
  assertBCP47tag?: boolean;
}

export function injectNavigatorLanguage(options?: {
  injector?: Injector;
  assertBCP47tag: true;
}): Intl.UnicodeBCP47LocaleIdentifier;
export function injectNavigatorLanguage(options?: {
  injector?: Injector;
  assertBCP47tag?: false;
}): string;
export function injectNavigatorLanguage(
  options?: InjectNavigatorLanguageOptions,
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
  options?: InjectNavigatorLanguageOptions,
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

    try {
      new Intl.Locale(navigatorLanguage);
    } catch (error) {
      throw new Error(
        `Navigator language '${navigatorLanguage}' is not a valid BCP 47 tag.`,
        {
          cause: error,
        },
      );
    }

    return navigatorLanguage as Intl.UnicodeBCP47LocaleIdentifier;
  });
}
