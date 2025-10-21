import {
  Directive,
  effect,
  inject,
  input,
  inputBinding,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import type { Block } from '@robby-rabbitman/cv-libs-cv-types';
import { EditorCvBlock } from './blocks/editor-cv-block';
import { EditorSectionBlock } from './blocks/editor-section-block';

@Directive({
  selector: '[cv--editor--block]',
  standalone: true,
})
export class CvEditorBlockRenderer {
  protected readonly block = input.required<Block>({
    alias: 'cv--editor--block',
  });
  protected readonly view = inject(ViewContainerRef);

  protected readonly blocks = {
    cv: EditorCvBlock,
    section: EditorSectionBlock,
  };

  protected readonly renderBlock = effect((cleanUp) => {
    const block = this.block();

    untracked(() => {
      /** TODO: remove type assertion by implementing all block types */
      const component = this.blocks[block.type as 'cv'];

      if (!component) {
        return;
      }

      this.view.createComponent(component, {
        bindings: [inputBinding('block', this.block)],
      });

      cleanUp(() => this.view.clear());
    });
  });
}
