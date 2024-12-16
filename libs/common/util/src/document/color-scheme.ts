import { DOCUMENT } from '@angular/common';
import {
  DestroyRef,
  type EffectRef,
  Injector,
  type Signal,
  effect,
  inject,
  signal,
} from '@angular/core';
import { type ColorScheme } from '@robby-rabbitman/cv-libs-common-types';
import { assertInjector } from 'ngxtension/assert-injector';
import { injectWindow } from './inject-window';

export interface ColorSchemeOptions {
  colorScheme: Signal<ColorScheme>;
  injector?: Injector;
  targetElement?: HTMLElement;
}

/**
 * Sets the color scheme for the given element reactively.
 *
 * - Uses the document element, if no target element is provided.
 */
export function setColorScheme(options: ColorSchemeOptions): EffectRef {
  const { colorScheme, injector, targetElement } = options;

  return assertInjector(setColorScheme, injector, () => {
    const element = targetElement ?? inject(DOCUMENT).documentElement;

    return effect((cleanUp) => {
      const _colorScheme = colorScheme();

      if (_colorScheme === 'system') {
        return;
      }

      element.style.setProperty('color-scheme', _colorScheme);

      cleanUp(() => element.style.removeProperty('color-scheme'));
    });
  });
}

/** Gets the preferred color scheme of the user. */
export function getPreferredColorScheme(options?: {
  injector?: Injector;
}): Signal<ColorScheme> {
  const { injector } = options ?? {};

  return assertInjector(getPreferredColorScheme, injector, () => {
    const preferredColorScheme = signal<ColorScheme>('system');

    const matchMedia = injectWindow({ injector }).matchMedia;

    if (!matchMedia) {
      return preferredColorScheme;
    }

    const possibleColorSchemePreferences = [
      'light',
      'dark',
    ] as const satisfies ColorScheme[];

    for (const possibleColorSchemePreference of possibleColorSchemePreferences) {
      const query = matchMedia(
        `(prefers-color-scheme: ${possibleColorSchemePreference})`,
      );

      /**
       * Check immediately if the query matches the current color scheme
       * preference.
       */
      if (query.matches) {
        preferredColorScheme.set(possibleColorSchemePreference);
      }

      /** Listen for changes in the color scheme preference. */

      const listener = ({ matches }: MediaQueryListEvent) => {
        if (matches) {
          preferredColorScheme.set(possibleColorSchemePreference);
        }
      };

      query.addEventListener('change', listener);

      inject(DestroyRef).onDestroy(() => {
        query.removeEventListener('change', listener);
      });
    }

    return preferredColorScheme;
  });
}
