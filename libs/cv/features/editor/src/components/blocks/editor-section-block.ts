import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import type { Cv } from '@robby-rabbitman/cv-libs-cv-types';
import { CvEditorBlockRenderer } from '../cv-editor-block-renderer';
import { EditorBlock } from './editor-block';

@Component({
  selector: 'cv--editor--section-block',
  imports: [forwardRef(() => CvEditorBlockRenderer)],
  template: `
    @for (block of block().children; track block.id) {
      <ng-template [cv--editor--block]="block" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorSectionBlock extends EditorBlock<Cv> {}
