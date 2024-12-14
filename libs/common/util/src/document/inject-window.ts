import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { createInjectionToken } from 'ngxtension/create-injection-token';

export const [
  /**
   * Injects the window.
   *
   * @see {@link DOCUMENT}
   */
  injectWindow,
] = createInjectionToken(() => {
  const document = inject(DOCUMENT);

  const window = document.defaultView;

  if (!window) throw new Error('There is no window in this document.');

  return window;
});
