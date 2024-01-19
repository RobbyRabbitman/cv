import { Signal, Type, forwardRef, inject, signal } from '@angular/core';
import { Field, SimpleField } from '@cv/common-types';
import {
  createInjectionToken,
  createNoopInjectionToken,
} from 'ngxtension/create-injection-token';

export function setValueOfSimpleField<T>(
  target: SimpleField<T>,
  value: T,
): SimpleField<T> {
  return { ...target, value };
}

const [, _provideField] = createNoopInjectionToken<{
  field: Signal<Field>;
}>('FIELD');

export function provideField(value: Type<{ field: Signal<Field> }>) {
  return _provideField(() => inject(forwardRef(() => value)));
}

export const [injectBlockLabel, provideBlockLabel] = createInjectionToken(
  () => {
    // const prototype = injectPrototype({ self: true });
    // const translation = injectTranslation();
    return signal('<<label>>').asReadonly();
  },
);
