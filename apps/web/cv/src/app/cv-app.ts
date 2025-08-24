import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CvApi, CvStore } from '@robby-rabbitman/cv-libs-cv-data';

@Component({
  selector: 'cv',
  template: `<h1 class="bg-red-400">Welcome to CV App!</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvApp {
  constructor() {
    console.log(inject(CvStore).cvEntities());
    console.log(inject(CvApi));
  }
}
