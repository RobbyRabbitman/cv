import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { fromEvent } from '@cv/common/util';
import { Translate } from '@cv/i18n/smart';
import { RangeField } from '@cv/types';
import { map } from 'rxjs';
import { BlockDirective } from '../block.directive';

@Component({
  selector: 'cv--edit-range',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './range.scss',
  imports: [Translate],
  hostDirectives: [{ directive: BlockDirective, inputs: ['block:value'] }],
  template: `<label [for]="range.block().id" class="px-2.5 col-span-full">
      {{ range.translatePrefix() + '.LABEL' | translate }}
    </label>
    <input
      #input
      type="range"
      class="control"
      [id]="range.block().id"
      [attr.list]="optionsId()"
      [value]="range.block().value"
      [min]="range.block().min"
      [max]="range.block().max"
      [attr.aria-valuemin]="
        range.translatePrefix() + '.OPTIONS.' + range.block().min | translate
      "
      [attr.aria-valuemax]="
        range.translatePrefix() + '.OPTIONS.' + range.block().max | translate
      "
      [attr.aria-valuetext]="
        range.translatePrefix() + '.OPTIONS.' + range.block().value | translate
      "
    />
    <datalist [id]="optionsId()">
      @for (option of options(); track option) {
        <option
          [value]="option"
          [label]="range.translatePrefix() + '.OPTIONS.' + option | translate"
        ></option>
      }
    </datalist>
    <span aria-hidden="true">
      {{
        range.translatePrefix() + '.OPTIONS.' + range.block().value | translate
      }}
    </span>`,
})
export class RangeEdit {
  protected range = inject<BlockDirective<RangeField>>(BlockDirective);

  protected options = computed(() => {
    const block = this.range.block();

    return Array.from({ length: block.max - block.min + 1 }).map(
      (_, i) => i - block.min,
    );
  });

  protected optionsId = computed(() => `${this.range.block().id}__options`);

  constructor() {
    fromEvent(this.input, 'input')
      .pipe(
        map(({ target }) => this.range.patch({ value: target.valueAsNumber })),
      )
      .subscribe();
  }

  @ViewChild('input', { read: ElementRef })
  protected set _input(input: ElementRef | undefined) {
    this.input.set(input?.nativeElement);
  }

  protected input = signal<HTMLInputElement | undefined>(undefined);
}
