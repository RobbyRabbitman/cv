import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { UUID } from '@cv/common/types';
import { CvStore } from '@cv/data';
import { I18nStore } from '@cv/i18n/data';
import { Block, BlockPrototype, Cv } from '@cv/types';
import { AddChildBlockButtonRibbon } from './add-child-block-button-ribbon';
import { SectionEditor } from './section';

@Component({
  selector: 'cv-edit--cv',
  standalone: true,
  host: {
    class: 'cv-edit--cv',
  },
  imports: [SectionEditor, AddChildBlockButtonRibbon],
  templateUrl: './cv.html',
  styleUrl: './cv.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvEditor {
  store = inject(CvStore);

  i18n = inject(I18nStore);

  cv = input.required<Cv>();

  prototypes = input.required<Record<UUID, BlockPrototype>>();

  patch<TBlock extends Block>(block: TBlock) {
    this.store.patchBlock(this.cv(), block);
  }

  translate(options: {
    blockOrPrototype: Block | BlockPrototype;
    key: string;
    params?: Record<string, string>;
  }) {
    return computed(() =>
      this.i18n.translateBlock({
        cv: this.cv(),
        blockOrPrototype: options.blockOrPrototype,
        key: options.key,
        options: {
          params: options.params,
        },
      })(),
    );
  }

  translateBlockPrefix = (blockOrPrototype: Block | BlockPrototype) =>
    computed(() =>
      this.i18n.translateBlockPrefix({
        cv: this.cv(),
        blockOrPrototype,
      }),
    );

  protected sectionPrototypes = computed(() =>
    this.store.getChildPrototypes(this.cv())(),
  );
}
