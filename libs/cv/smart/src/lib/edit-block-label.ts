import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { CvStore } from '@cv/cv/data';
import { Block, CanBeLabeled, Cv } from '@cv/cv/types';
import { I18nStore } from '@cv/i18n/data';

@Component({
  selector: 'cv-smart--edit-block-label',
  standalone: true,
  template: `<label class="flex flex-col gap-2">
    <span class="sr-only">{{ label() || blockLabel() }}</span>
    <ng-content select="[slot=before]"></ng-content>
    <input
      class="outline-none bg-inherit font-bold hover:text-secondary placeholder:hover:text-secondary placeholder:font-bold border-solid border-transparent border-b-2 hover:border-secondary focus:border-secondary"
      [placeholder]="placeholder() || blockPlaceholder()"
      [style.width.ch]="
        value().length || placeholder().length || blockPlaceholder().length
      "
      [value]="value()"
      (input)="onChange($event)"
      type="text"
    />
    <ng-content select="[slot=after]"></ng-content>
  </label>`,
  styleUrl: './edit-block-label.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBlockLabel {
  protected readonly store = inject(CvStore);

  protected readonly i18n = inject(I18nStore);

  readonly block = input.required<Block & CanBeLabeled>();

  readonly cv = input.required<Cv>();

  readonly label = input('');

  readonly placeholder = input('');

  readonly blockLabel = computed(() =>
    this.i18n.translateBlock({
      blockOrPrototype: this.block(),
      cv: this.cv(),
      key: 'LABEL',
    })(),
  );

  readonly blockPlaceholder = computed(() =>
    this.i18n.translateBlock({
      blockOrPrototype: this.block(),
      cv: this.cv(),
      key: 'PLACEHOLDER',
    })(),
  );

  protected readonly prototype = computed(() =>
    this.store.getPrototype(this.block().prototypeId),
  );

  protected readonly value = computed(() => this.block().label ?? '');

  protected onChange(event: Event) {
    this.store.patchBlock(this.cv(), {
      id: this.block().id,
      label: (event.target as HTMLInputElement).value,
    });
  }
}
