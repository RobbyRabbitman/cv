import {
  ENVIRONMENT_INITIALIZER,
  ElementRef,
  Injector,
  makeEnvironmentProviders,
} from '@angular/core';
import { assertInjector } from 'ngxtension/assert-injector';

export function runOnEnvironmentInit(initFn: () => void) {
  return () =>
    makeEnvironmentProviders([
      {
        provide: ENVIRONMENT_INITIALIZER,
        multi: true,
        useFactory: () => initFn,
      },
    ]);
}

export function injectElement<TElement extends Element = HTMLElement>(
  injector?: Injector,
) {
  injector = assertInjector(injectElement, injector);

  return injector.get(ElementRef).nativeElement as TElement;
}
