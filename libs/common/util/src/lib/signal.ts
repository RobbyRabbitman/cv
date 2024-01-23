import { Injector, Signal, isSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { assertInjector } from 'ngxtension/assert-injector';
import { EMPTY, map, of, fromEvent as rxjsFromEvent, switchMap } from 'rxjs';

export function fromEvent<T extends HTMLElement>(
  target: Signal<undefined | T> | T,
  event: string,
  injector?: Injector,
) {
  assertInjector(fromEvent, injector);

  return (isSignal(target) ? toObservable(target) : of(target)).pipe(
    switchMap((target) => {
      if (target == null) return EMPTY;
      return rxjsFromEvent(target, event).pipe(
        map((event) => ({ event, target })),
      );
    }),
  );
}
