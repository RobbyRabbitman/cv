import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injector, Signal, effect, signal } from '@angular/core';
import { Theme } from '@cv/common/types';
import { assertInjector } from 'ngxtension/assert-injector';

export function applyTheme(theme: Signal<Theme>, injector?: Injector): void {
  injector = assertInjector(applyTheme, injector);

  const root = injector.get(DOCUMENT).documentElement.classList;

  effect((cleanUp) => {
    const _theme = theme();

    root.add(_theme);

    cleanUp(() => root.remove(_theme));
  });
}

/** Injects the theme from the document. Returns `light` when the theme cannot be read. */
export function injectDocumentTheme(injector?: Injector): Signal<Theme> {
  injector = assertInjector(injectDocumentTheme, injector);

  const theme = signal<Theme>('light');

  const matchMedia = injector.get(DOCUMENT).defaultView?.matchMedia;

  if (!matchMedia) return theme;

  const query = matchMedia('(prefers-color-scheme: dark)');

  theme.set(query.matches ? 'dark' : 'light');

  const listener = ({ matches }: MediaQueryListEvent) => {
    theme.set(matches ? 'dark' : 'light');
  };

  query.addEventListener('change', listener);

  injector
    .get(DestroyRef)
    .onDestroy(() => query.removeEventListener('change', listener));

  return theme;
}
