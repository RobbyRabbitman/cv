import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Output,
  ViewChild,
  input,
  signal,
} from '@angular/core';
import { RangeField } from '@cv/common-types';
import {
  BlockLabelPipe,
  fromSignalEvent,
  setValueOfSimpleField,
} from '@cv/common-util';
import { map } from 'rxjs';

@Component({
  selector: 'cv-common-ui--range-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockLabelPipe],
  template: `<label>
    {{ (field | cvBlockLabel)() }}
    <input
      type="range"
      [value]="field().value"
      [min]="field().min"
      [max]="field().max"
    />
  </label>`,
})
export class RangeFieldComponent {
  @ViewChild('input', { read: ElementRef })
  protected set _input(input: ElementRef | undefined) {
    this.input.set(input?.nativeElement);
  }

  protected input = signal<HTMLInputElement | undefined>(undefined);

  field = input.required<RangeField>();

  @Output()
  fieldChange = fromSignalEvent(this.input, 'input').pipe(
    map(({ target }) =>
      setValueOfSimpleField(this.field(), Number(target.value)),
    ),
  );
}
