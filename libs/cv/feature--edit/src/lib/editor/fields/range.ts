import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { fromEventOfSignal } from '@cv/common/util';
import { RangeField } from '@cv/cv/types';
import { Translate } from '@cv/i18n/smart';
import { map } from 'rxjs';
import { BlockDirective } from '../block.directive';

@Component({
  selector: 'cv-edit--range',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './range.scss',
  imports: [Translate],
  host: {
    class: 'cv-edit--range',
  },
  hostDirectives: [{ directive: BlockDirective, inputs: ['value'] }],
  template: `<label [for]="range.instance().id" class="px-2.5 col-span-full">
      {{ range.translatePrefix() + '.LABEL' | translate }}
    </label>
    <input
      #input
      type="range"
      class="control"
      [id]="range.instance().id"
      [attr.list]="optionsId()"
      [value]="range.instance().value"
      [min]="range.instance().min"
      [max]="range.instance().max"
      [attr.aria-valuemin]="
        range.translatePrefix() + '.OPTIONS.' + range.instance().min | translate
      "
      [attr.aria-valuemax]="
        range.translatePrefix() + '.OPTIONS.' + range.instance().max | translate
      "
      [attr.aria-valuetext]="
        range.translatePrefix() + '.OPTIONS.' + range.instance().value
          | translate
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
        range.translatePrefix() + '.OPTIONS.' + range.instance().value
          | translate
      }}
    </span>`,
})
export class RangeEdit {
  protected readonly range = inject<BlockDirective<RangeField>>(BlockDirective);

  protected readonly options = computed(() => {
    const block = this.range.instance();

    return Array.from({ length: block.max - block.min + 1 }).map(
      (_, i) => i - block.min,
    );
  });

  protected readonly optionsId = computed(
    () => `${this.range.instance().id}__options`,
  );

  constructor() {
    this.patchRangeOnInput();
  }

  protected patchRangeOnInput() {
    fromEventOfSignal(this.input, 'input')
      .pipe(
        map((event) =>
          this.range.patch({
            value: (event.target as HTMLInputElement).valueAsNumber,
          }),
        ),
      )
      .subscribe();
  }

  readonly input = viewChild.required('input', { read: ElementRef });
}
