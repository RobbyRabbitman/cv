import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { CvStore } from '@cv/data';
import { Block, CanBeLabeled, Cv } from '@cv/types';

@Component({
  selector: 'cv-smart--edit-block-label',
  standalone: true,
  template: `<label class="flex flex-col gap-2">
    <span class="sr-only">{{ label() }}</span>
    <ng-content select="[slot=before]"></ng-content>
    <input
      class="outline-none bg-inherit font-bold hover:text-secondary placeholder:hover:text-secondary placeholder:font-bold border-solid border-transparent border-b-2 hover:border-secondary focus:border-secondary"
      [placeholder]="placeholder()"
      [style.width.ch]="value().length || placeholder().length"
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
  protected store = inject(CvStore);

  block = input.required<Block & CanBeLabeled>();

  cv = input.required<Cv>();

  label = input.required<string>();

  placeholder = input('');

  protected prototype = computed(() =>
    this.store.getPrototype(this.block().prototypeId),
  );

  protected value = computed(() => this.block().label ?? '');

  protected onChange(event: Event) {
    this.store.patchBlock(this.cv(), {
      id: this.block().id,
      label: (event.target as HTMLInputElement).value,
    });
  }
}
