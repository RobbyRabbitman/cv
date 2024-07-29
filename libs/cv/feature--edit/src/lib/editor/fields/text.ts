import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  inject,
  viewChild,
} from '@angular/core';
import { fromEventOfSignal } from '@cv/common/util';
import { TextField } from '@cv/cv/types';
import { Translate } from '@cv/i18n/smart';
import { map } from 'rxjs';
import { BlockDirective } from '../block.directive';

@Component({
  selector: 'cv-edit--text',
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
    this.patchTextOnInput();
  }

  protected patchTextOnInput() {
    fromEventOfSignal(this.input, 'input')
      .pipe(
        map((event) =>
          this.text.patch({
            value: (event.target as HTMLInputElement).value,
          }),
        ),
      )
      .subscribe();
  }

  readonly input = viewChild.required('input', { read: ElementRef });
}
