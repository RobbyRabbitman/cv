import { Directive, computed, inject, input } from '@angular/core';
import { CvStore } from '@cv/data';
import { Block } from '@cv/types';
import { CvEditor } from './cv';

@Directive({
  standalone: true,
})
export class BlockDirective<TBlock extends Block> {
  store = inject(CvStore);

  editor = inject(CvEditor);

  translatePrefix = computed(() =>
    this.editor.translatePrefix(this.instance())(),
  );

  instance = input.required<TBlock>({ alias: 'value' });

  childPrototypes = computed(() =>
    this.store.getChildPrototypes(this.instance())(),
  );

  patch(value: Partial<Omit<TBlock, 'id'>>) {
    this.editor.patch({ ...this.instance(), ...value });
  }
}
