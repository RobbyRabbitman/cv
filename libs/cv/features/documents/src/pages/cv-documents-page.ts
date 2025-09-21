import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CreateCvButton } from '@robby-rabbitman/cv-libs-cv-components';
import { CvStore } from '@robby-rabbitman/cv-libs-cv-data';
import { CvDocuments } from '../components/cv-documents';

/**
 * TOOD: make the create cv button a floating action button positioned in a
 * bottom corner?
 */
@Component({
  selector: 'cv--documents-page',
  imports: [CreateCvButton, CvDocuments],
  host: { class: 'flex flex-col py-8 gap-8' },
  template: `<cv--create-cv-button /><cv--documents />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CvDocumentsPage {
  protected cv = inject(CvStore);
}
