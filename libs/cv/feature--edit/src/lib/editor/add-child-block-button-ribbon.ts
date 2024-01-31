import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { CvStore } from '@cv/data';
import { Translate } from '@cv/i18n/smart';
import { Block, BlockPrototype, HasChildren } from '@cv/types';
import { createBlock } from '@cv/util';
import { BlockDirective } from './block.directive';

@Component({
  selector: 'cv--edit-add-child-block-button-ribbon',
  standalone: true,
  imports: [Translate],
  hostDirectives: [{ directive: BlockDirective, inputs: ['value:for'] }],
  template: `@for (
    childPrototype of creatableChildPrototypes();
    track childPrototype.id
  ) {
    <button (click)="addChild(childPrototype)">
      {{ block.translatePrefix() + '.LABEL' | translate }}
    </button>
  }`,
  styleUrl: './add-child-block-button-ribbon.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddChildBlockButtonRibbon {
  protected block =
    inject<BlockDirective<Block & HasChildren<Block>>>(BlockDirective);

  protected cvStore = inject(CvStore);

  protected prototype = computed(
    () => this.cvStore.prototypeEntityMap()[this.block.instance().prototypeId],
  );

  protected creatableChildPrototypes = computed(() => {
    const childPrototypes = this.block.childPrototypes();
    const block = this.block.instance();

    return childPrototypes.filter((prototype) => {
      if (prototype.multiple) return prototype;

      return block.children.every(
        (childBlock) => childBlock.prototypeId !== prototype.id,
      );
    });
  });

  protected addChild(prototype: BlockPrototype) {
    const block = this.block.instance();
    if (!prototype.multiple) return;
    this.block.patch({
      children: [
        ...block.children,
        createBlock(prototype, this.block.editor.prototypes()),
      ],
    });
  }
}
