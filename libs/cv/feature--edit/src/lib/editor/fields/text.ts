import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  inject,
  input,
  signal,
} from '@angular/core';
import { fromEvent } from '@cv/common/util';
import { TextField } from '@cv/types';
import { map } from 'rxjs';
import { CvEditor } from '../cv';

@Component({
  selector: 'cv--edit-text',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<label>
    {{ field().prototypeId }}
    <input #input class="input" type="text" [value]="field().value" />
  </label>`,
})
export class TextEdit {
  editor = inject(CvEditor);

  constructor() {
    fromEvent(this.input, 'input')
      .pipe(
        map(({ target }) =>
          this.editor.patch({ ...this.field(), value: target.value }),
        ),
      )
      .subscribe();
  }

  @ViewChild('input', { read: ElementRef })
  protected set _input(input: ElementRef | undefined) {
    this.input.set(input?.nativeElement);
  }

  protected input = signal<HTMLInputElement | undefined>(undefined);

  field = input.required<TextField>();
}
