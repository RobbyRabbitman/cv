import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Output,
  ViewChild,
  input,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { TextField } from '@cv/common-types';
import {
  injectBlockLabel,
  provideField,
  setValueOfSimpleField,
} from '@cv/common-util';
import { EMPTY, fromEvent, map, switchMap } from 'rxjs';

@Component({
  selector: 'cv-common-ui-text-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideField(TextFieldComponent)],
  template: `<label>
    {{ label() }}
    <input type="text" [value]="field().value" />
  </label>`,
})
export class TextFieldComponent {
  @ViewChild('input', { read: ElementRef })
  protected set _input(input: ElementRef) {
    this.input.set(input.nativeElement);
  }

  protected input = signal<HTMLInputElement | undefined>(undefined);

  protected label = injectBlockLabel();

  field = input.required<TextField>();

  @Output()
  fieldChange = toObservable(this.input).pipe(
    switchMap((input) => {
      if (input == null) return EMPTY;
      return fromEvent(input, 'input');
    }),
    map((event) =>
      setValueOfSimpleField(
        this.field(),
        (event.target as HTMLInputElement).value,
      ),
    ),
  );
}
