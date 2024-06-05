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

  cv = input.required<Cv>();

  prototypes = input.required<Record<UUID, BlockPrototype>>();

  patch<TBlock extends Block>(block: TBlock) {
    this.store.patchBlock(this.cv(), block);
  }

  translatePrefix = (blockOrBlockPrototype: Block | BlockPrototype) =>
    computed(() =>
      `CV.EDIT.${this.cv().templateId}.${'prototypeId' in blockOrBlockPrototype ? blockOrBlockPrototype.prototypeId : blockOrBlockPrototype.id}`.toUpperCase(),
    );

  protected sectionPrototypes = computed(() =>
    this.store.getChildPrototypes(this.cv())(),
  );
}
