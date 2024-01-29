import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { CvStore } from '@cv/data';
import { Block, BlockPrototype, HasChildren } from '@cv/types';
import { createBlock } from '@cv/util';
import { CvEditor } from './cv';

@Component({
  selector: 'cv--edit-add-child-block-button-ribbon',
  standalone: true,
  imports: [],
  template: `@for (
    childPrototype of childPrototypes();
    track childPrototype.id
  ) {
    <button (click)="addChild(childPrototype)">{{ 'LABEL' }}</button>
  }`,
  styleUrl: './add-child-block-button-ribbon.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddChildBlockButtonRibbon {
  protected editor = inject(CvEditor);

  protected cvStore = inject(CvStore);

  block = input.required<Block & HasChildren<Block>>();

  protected prototype = computed(
    () => this.cvStore.prototypeEntityMap()[this.block().prototypeId],
  );

  protected childPrototypes = computed(() => {
    const block = this.block();
    const childPrototypes = this.cvStore.getChildPrototypes(block)();

    return childPrototypes.filter((prototype) => {
      if (prototype.multiple) return prototype;

      return block.children.every(
        (childBlock) => childBlock.prototypeId !== prototype.id,
      );
    });
  });

  protected addChild(prototype: BlockPrototype) {
    const block = this.block();
    if (!prototype.multiple) return;
    this.editor.patch({
      ...block,
      children: [
        ...block.children,
        createBlock(prototype, this.editor.prototypes()),
      ],
    });
  }
}
