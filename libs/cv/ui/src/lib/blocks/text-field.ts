import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Output,
  ViewChild,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { fromEvent } from '@cv/common/util';
import { TextField as TextFieldType } from '@cv/types';
import { setValueOfSimpleField } from '@cv/util';
import { map } from 'rxjs';

@Component({
  selector: 'cv-ui--text-field',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<label>
    {{ field().prototypeId }}
    <input type="text" [value]="field().value" />
  </label>`,
})
export class TextField {
  @ViewChild('input', { read: ElementRef })
  protected set _input(input: ElementRef | undefined) {
    this.input.set(input?.nativeElement);
  }

  protected input = signal<HTMLInputElement | undefined>(undefined);

  field = input.required<TextFieldType>();

  @Output()
  fieldChange = fromEvent(this.input, 'input').pipe(
    map(({ target }) => setValueOfSimpleField(this.field(), target.value)),
  );
}
