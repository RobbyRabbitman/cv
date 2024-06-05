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
        childPrototype.translatePrefix() + '.ADD.LABEL'
          | translate
            : { label: childPrototype.translatePrefix() + '.LABEL' | translate }
      "
    >
      <span aria-hidden="true" class="icon">add</span>
      <span aria-hidden="true">
        {{ childPrototype.translatePrefix() + '.LABEL' | translate }}
      </span>
    </button>
  }`,
  styleUrl: './add-child-block-button-ribbon.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddChildBlockButtonRibbon {
  protected readonly block =
    inject<BlockDirective<Block & HasChildren<Block>>>(BlockDirective);

  protected readonly store = inject(CvStore);

  protected readonly creatableChildPrototypes = computed(() => {
    const childPrototypes = this.block.childPrototypes();

    return childPrototypes
      .filter((prototype) => prototype.multiple)
      .map((value) => {
        return {
          value,
          translatePrefix: computed(() =>
            this.block.editor.translateBlockPrefix(value)(),
          ),
        };
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
