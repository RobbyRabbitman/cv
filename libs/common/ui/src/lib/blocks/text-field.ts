import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Output,
  ViewChild,
  input,
  signal,
} from '@angular/core';
import { TextField } from '@cv/common-types';
import {
  BlockLabelPipe,
  fromSignalEvent,
  setValueOfSimpleField,
} from '@cv/common-util';
import { map } from 'rxjs';

@Component({
  selector: 'cv-common-ui--text-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockLabelPipe],
  template: `<label>
    {{ (field | cvBlockLabel)() }}
    <input type="text" [value]="field().value" />
  </label>`,
})
export class TextFieldComponent {
  @ViewChild('input', { read: ElementRef })
  protected set _input(input: ElementRef | undefined) {
    this.input.set(input?.nativeElement);
  }

  protected input = signal<HTMLInputElement | undefined>(undefined);

  field = input.required<TextField>();

  @Output()
  fieldChange = fromSignalEvent(this.input, 'input').pipe(
    map(({ target }) => setValueOfSimpleField(this.field(), target.value)),
  );
}
