import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { Field } from '@cv/types';
import { RangeEdit } from './fields/range';
import { TextEdit } from './fields/text';

@Component({
  selector: 'cv--edit-field',
  standalone: true,
  imports: [TextEdit, RangeEdit],
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
