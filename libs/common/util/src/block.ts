import { Injector, Pipe, PipeTransform, Signal, signal } from '@angular/core';
import { Block, SimpleField } from '@cv/common-types';
import { assertInjector } from 'ngxtension/assert-injector';

/**
 *
 * @param field
 * @param value
 * @returns a shallow copy of the field with the new value.
 */
export function setValueOfSimpleField<T>(
  field: SimpleField<T>,
  value: T,
): SimpleField<T> {
  return { ...field, value };
}

export function injectBlockLabel(injector?: Injector) {
  assertInjector(injectBlockLabel, injector);
  // TODO real impl
  return function (block: Signal<Block>): Signal<string> {
    return signal(block().prototypeId).asReadonly();
  };
}

@Pipe({
  name: 'cvBlockLabel',
  standalone: true,
})
export class BlockLabelPipe implements PipeTransform {
  transform = injectBlockLabel();
}
