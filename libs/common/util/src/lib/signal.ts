import { DestroyRef, ElementRef, Injector, Signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { assertInjector } from 'ngxtension/assert-injector';
import { EMPTY, fromEvent, switchMap } from 'rxjs';

type FromEventOfSignalTarget<TElement extends HTMLElement = HTMLElement> =
  | undefined
  | TElement
  | ElementRef<TElement>;

export function fromEventOfSignal<TEvent extends Event = Event>(
  target: Signal<FromEventOfSignalTarget>,
  event: string,
  injector?: Injector,
) {
  injector = assertInjector(fromEventOfSignal, injector);

  return toObservable(target).pipe(
    switchMap((target) => {
      if (target == null) {
        return EMPTY;
      }
      target = 'nativeElement' in target ? target.nativeElement : target;
      return fromEvent<TEvent>(target, event);
    }),
    takeUntilDestroyed(injector.get(DestroyRef)),
  );
}
