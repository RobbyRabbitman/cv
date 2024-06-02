import { DestroyRef, Injector, Signal, isSignal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { assertInjector } from 'ngxtension/assert-injector';
import { EMPTY, map, of, fromEvent as rxjsFromEvent, switchMap } from 'rxjs';

export function fromEvent<
  TEvent extends Event = Event,
  TElement extends HTMLElement = HTMLElement,
>(
  target: Signal<undefined | TElement> | TElement,
  event: string,
  injector?: Injector,
) {
  injector = assertInjector(fromEvent, injector);

  return (isSignal(target) ? toObservable(target) : of(target)).pipe(
    switchMap((target) => {
      if (target == null) return EMPTY;
      return rxjsFromEvent<TEvent>(target, event).pipe(
        map((event) => ({ event, target })),
      );
    }),
    takeUntilDestroyed(injector.get(DestroyRef)),
  );
}
