import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, type Params } from '@angular/router';
import { map } from 'rxjs/operators';

export function injectRouteParameter<T = string>(parameter: string) {
  const route = inject(ActivatedRoute);

  const getParameter = (parameters: Params) =>
    parameters[parameter] as T | undefined;

  return toSignal(route.params.pipe(map(getParameter)), {
    initialValue: getParameter(route.snapshot.params),
  });
}
