import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { fromEvent } from '@cv/common/util';
import { Translate } from '@cv/i18n/smart';
import { TextField } from '@cv/types';
import { map } from 'rxjs';
import { CvEditor } from '../cv';

@Component({
  selector: 'cv--edit-text',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Translate],
  viewProviders: [],
  template: `<label class="flex flex-col gap-1">
    <span class="px-2.5">
      {{ this.translatePrefix() + '.LABEL' | translate }}
    </span>
    <input #input class="input" type="text" [value]="field().value" />
  </label>`,
})
export class TextEdit {
  protected editor = inject(CvEditor);

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

  protected translatePrefix = computed(() =>
    this.editor.translatePrefix(this.field())(),
  );

  field = input.required<TextField>();
}
