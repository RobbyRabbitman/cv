import { Observable, from, of } from 'rxjs';

export type MaybeAsync<T> = T | Promise<T> | Observable<T>;

export function wrapToObservable<T>(value: MaybeAsync<T>): Observable<T> {
  switch (true) {
    case value instanceof Observable: {
      return value;
    }

    case value instanceof Promise: {
      return from(value);
    }

    default: {
      return of(value);
    }
  }
}
