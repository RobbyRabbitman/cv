import { DOCUMENT } from '@angular/common';
import { Injector } from '@angular/core';
import { assertInjector } from 'ngxtension/assert-injector';

/** Injects the locale from the document. */
export function injectDocumentLocale(injector?: Injector) {
  injector = assertInjector(injectDocumentLocale, injector);
  return injector.get(DOCUMENT).defaultView!.navigator.language;
}
