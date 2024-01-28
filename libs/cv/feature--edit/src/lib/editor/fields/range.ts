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
import { RangeField as RangeFieldType } from '@cv/types';
import { map } from 'rxjs';
import { CvEditor } from '../cv';

@Component({
  selector: 'cv--edit-range',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<label>
    {{ field().prototypeId }}
    <input
      #input
      type="range"
      [value]="field().value"
      [min]="field().min"
      [max]="field().max"
    />
  </label>`,
})
export class RangeEdit {
  editor = inject(CvEditor);

  constructor() {
    fromEvent(this.input, 'input')
      .pipe(
        map(({ target }) =>
          this.editor.patch({ ...this.field(), value: Number(target.value) }),
        ),
      )
      .subscribe();
  }

  @ViewChild('input', { read: ElementRef })
  protected set _input(input: ElementRef | undefined) {
    this.input.set(input?.nativeElement);
  }

  protected input = signal<HTMLInputElement | undefined>(undefined);

  field = input.required<RangeFieldType>();
}
