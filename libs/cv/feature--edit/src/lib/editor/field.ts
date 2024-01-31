import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { Field } from '@cv/types';
import { BlockDirective } from './block.directive';
import { RangeEdit } from './fields/range';
import { TextEdit } from './fields/text';

@Component({
  selector: 'cv--edit-field',
  standalone: true,
  imports: [TextEdit, RangeEdit],
  hostDirectives: [{ directive: BlockDirective, inputs: ['value'] }],
  template: `@switch (field.instance().type) {
    @case ('text') {
      <cv--edit-text [value]="$any(field.instance())" />
    }
    @case ('range') {
      <cv--edit-range [value]="$any(field.instance())" />
    }
  }`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldEdit {
  protected field = inject<BlockDirective<Field>>(BlockDirective);
}
