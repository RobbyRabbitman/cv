import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { Field } from '@cv/types';
import RangeField from './fields/range';
import TextField from './fields/text';

@Component({
  selector: 'cv--edit-field',
  standalone: true,
  imports: [TextField, RangeField],
  template: `@switch (field().type) {
    @case ('text') {
      <cv--edit-text [field]="$any(field())" />
    }
    @case ('range') {
      <cv--edit-range [field]="$any(field())" />
    }
  }`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldEdit {
  field = input.required<Field>();
}
