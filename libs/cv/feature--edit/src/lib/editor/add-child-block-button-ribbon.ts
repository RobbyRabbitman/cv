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
  selector: 'cv-edit--add-child-block-button-ribbon',
  standalone: true,
  imports: [Translate],
  host: {
    class: 'cv-edit--add-child-block-button-ribbon',
  },
  hostDirectives: [{ directive: BlockDirective, inputs: ['value:for'] }],
  template: `@for (
    childPrototype of creatableChildPrototypes();
    track childPrototype.value.id
  ) {
    <button
      class="inline-flex items-center gap-1 control p-2"
      (click)="addChild(childPrototype.value)"
      [attr.aria-label]="
        childPrototype.translation.add()
          | translate: { label: childPrototype.translation.label() | translate }
      "
    >
      <span aria-hidden="true" class="icon">add</span>
      {{ childPrototype.translation.label() | translate }}
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

    return childPrototypes
      .filter((prototype) => {
        if (prototype.multiple) return prototype;

        return block.children.every(
          (childBlock) => childBlock.prototypeId !== prototype.id,
        );
      })
      .map((value) => ({
        value,
        translation: {
          label: computed(
            () => `${this.block.editor.translatePrefix(value)()}.LABEL`,
          ),
          add: computed(
            () => `${this.block.editor.translatePrefix(value)()}.ADD.LABEL`,
          ),
        },
      }));
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
