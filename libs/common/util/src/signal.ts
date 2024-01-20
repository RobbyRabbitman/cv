import { Injector, Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { assertInjector } from 'ngxtension/assert-injector';
import { EMPTY, fromEvent, map, switchMap } from 'rxjs';

export function fromSignalEvent<T extends HTMLElement>(
  target: Signal<undefined | T>,
  event: string,
  injector?: Injector,
) {
  assertInjector(fromSignalEvent, injector);

  return toObservable(target).pipe(
    switchMap((target) => {
      if (target == null) return EMPTY;
      return fromEvent(target, event).pipe(map((event) => ({ event, target })));
    }),
  );
}
