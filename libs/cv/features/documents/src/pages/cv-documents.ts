import { Component, inject } from '@angular/core';
import { CvStore } from '@robby-rabbitman/cv-libs-cv-data';

@Component({
  selector: 'cv-documents',
  template: `cv documents works!`,
})
export default class CvDocuments {
  protected cv = inject(CvStore);
}
