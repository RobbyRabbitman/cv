import { Injector } from '@angular/core';
import { injectWindow } from '@cv/common/util';
import { assertInjector } from 'ngxtension/assert-injector';

/** Injects the locale from the document. */
export function injectDocumentLocale(injector?: Injector) {
  injector = assertInjector(injectDocumentLocale, injector);
  return injectWindow({ injector }).navigator.language;
}
