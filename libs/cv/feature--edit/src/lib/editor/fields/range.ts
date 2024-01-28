import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { RangeField as RangeFieldType } from '@cv/types';

@Component({
  selector: 'cv--edit-range',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<label>
    {{ field().prototypeId }}
    <input
      type="range"
      [value]="field().value"
      [min]="field().min"
      [max]="field().max"
    />
  </label>`,
})
export default class RangeField {
  @ViewChild('input', { read: ElementRef })
  protected set _input(input: ElementRef | undefined) {
    this.input.set(input?.nativeElement);
  }

  protected input = signal<HTMLInputElement | undefined>(undefined);

  field = input.required<RangeFieldType>();

  // @Output()
  // fieldChange = fromEvent(this.input, 'input').pipe(
  //   map(({ target }) =>
  //     setValueOfSimpleField(this.field(), Number(target.value)),
  //   ),
  // );
}
