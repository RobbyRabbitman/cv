import { Directive, input } from '@angular/core';
import type { Block } from '@robby-rabbitman/cv-libs-cv-types';

@Directive()
export class EditorBlock<T extends Block = Block> {
  protected readonly block = input.required<T>();
}
