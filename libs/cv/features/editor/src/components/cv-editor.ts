import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Cv } from '@robby-rabbitman/cv-libs-cv-types';
import { CvEditorBlockRenderer } from './cv-editor-block-renderer';

@Component({
  selector: 'cv--editor',
  imports: [CvEditorBlockRenderer],
  template: `<ng-template [cv--editor--block]="cv()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvEditor {
  protected readonly cv = input.required<Cv>();
}
