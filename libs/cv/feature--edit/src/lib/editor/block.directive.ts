import { Directive, computed, inject, input } from '@angular/core';
import { CvStore } from '@cv/cv/data';
import { Block } from '@cv/cv/types';
import { CvEditor } from './cv';

@Directive({
  standalone: true,
})
export class BlockDirective<TBlock extends Block> {
  store = inject(CvStore);

  editor = inject(CvEditor);

  translate = (options: { key: string; params?: Record<string, string> }) =>
    computed(() =>
      this.editor.translate({
        blockOrPrototype: this.instance(),
        ...options,
      })(),
    );

  translatePrefix = computed(() =>
    this.editor.translateBlockPrefix(this.instance())(),
  );

  instance = input.required<TBlock>({ alias: 'value' });

  childPrototypes = computed(() =>
    this.store.getChildPrototypes(this.instance())(),
  );

  patch(value: Partial<Omit<TBlock, 'id'>>) {
    this.editor.patch({ ...this.instance(), ...value });
  }
}
