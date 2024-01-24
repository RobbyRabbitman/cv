import { effect, inject } from '@angular/core';
import { injectWindow } from '@cv/common/util';
import { I18nStore } from '@cv/i18n/data';
import { createInjectionToken } from 'ngxtension/create-injection-token';

export const [, , , localizeDocument] = createInjectionToken(() => {
  const i18n = inject(I18nStore);
  const window = injectWindow();
  effect(() => (window.document.documentElement.lang = i18n.locale()));
});
