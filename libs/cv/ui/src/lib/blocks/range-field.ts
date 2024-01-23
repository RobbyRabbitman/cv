import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Output,
  ViewChild,
  input,
  signal,
} from '@angular/core';
import { fromSignalEvent } from '@cv/common/util';
import { RangeField as RangeFieldType } from '@cv/types';
import { setValueOfSimpleField } from '@cv/util';
import { map } from 'rxjs';

@Component({
  selector: 'cv-ui--range-field',
  standalone: true,
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
export class RangeField {
  @ViewChild('input', { read: ElementRef })
  protected set _input(input: ElementRef | undefined) {
    this.input.set(input?.nativeElement);
  }

  protected input = signal<HTMLInputElement | undefined>(undefined);

  field = input.required<RangeFieldType>();

  @Output()
  fieldChange = fromSignalEvent(this.input, 'input').pipe(
    map(({ target }) =>
      setValueOfSimpleField(this.field(), Number(target.value)),
    ),
  );
}
