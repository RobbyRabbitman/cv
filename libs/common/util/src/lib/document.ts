import { DOCUMENT } from '@angular/common';
import { ElementRef, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { createInjectionToken } from 'ngxtension/create-injection-token';
import { filter, fromEvent, map } from 'rxjs';

export const [injectWindow] = createInjectionToken(() => {
  const document = inject(DOCUMENT);

  const window = document.defaultView;

  if (!window)
    throw new Error('[Common]: There is no window in this document.');

  return window;
});

export const [activeElement] = createInjectionToken(() => {
  const document = inject(DOCUMENT);

  return toSignal(
    fromEvent(document, 'focusin').pipe(map(() => document.activeElement)),
    { initialValue: document.activeElement },
  );
});

export function isActiveElement() {
  const _activeElement = activeElement();
  const element = inject(ElementRef).nativeElement;
  return computed(() => _activeElement() === element);
}

export const [documentClick] = createInjectionToken(() => {
  const document = inject(DOCUMENT);
  return fromEvent(document, 'click').pipe(takeUntilDestroyed());
});

export function nativeElement<TElement extends HTMLElement>() {
  return inject(ElementRef).nativeElement as TElement;
}

export function outsideClick() {
  const element = nativeElement();
  return documentClick().pipe(
    filter((event) => !element.contains(event.target as Node | null)),
    takeUntilDestroyed(),
  );
}
