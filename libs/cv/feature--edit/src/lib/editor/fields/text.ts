import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { fromEvent } from '@cv/common/util';
import { Translate } from '@cv/i18n/smart';
import { TextField } from '@cv/types';
import { map } from 'rxjs';
import { BlockDirective } from '../block.directive';

@Component({
  selector: 'cv--edit-text',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Translate],
  hostDirectives: [{ directive: BlockDirective, inputs: ['value'] }],
  template: `<label class="flex flex-col gap-1">
    <span class="px-2.5">
      {{ text.translatePrefix() + '.LABEL' | translate }}
    </span>
    <input #input class="input" type="text" [value]="text.instance().value" />
  </label>`,
})
export class TextEdit {
  protected text = inject<BlockDirective<TextField>>(BlockDirective);

  constructor() {
    fromEvent(this.input, 'input')
      .pipe(map(({ target }) => this.text.patch({ value: target.value })))
      .subscribe();
  }

  @ViewChild('input', { read: ElementRef })
  protected set _input(input: ElementRef | undefined) {
    this.input.set(input?.nativeElement);
  }

  protected input = signal<HTMLInputElement | undefined>(undefined);
}
