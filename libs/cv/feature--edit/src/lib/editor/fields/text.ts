import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { TextField } from '@cv/types';

@Component({
  selector: 'cv--edit-text',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<label>
    {{ field().prototypeId }}
    <input type="text" [value]="field().value" />
  </label>`,
})
export default class TextEdit {
  @ViewChild('input', { read: ElementRef })
  protected set _input(input: ElementRef | undefined) {
    this.input.set(input?.nativeElement);
  }

  protected input = signal<HTMLInputElement | undefined>(undefined);

  field = input.required<TextField>();

  // @Output()
  // fieldChange = fromEvent(this.input, 'input').pipe(
  //   map(({ target }) => setValueOfSimpleField(this.field(), target.value)),
  // );
}
