import { Directive, inject, input } from '@angular/core';
import type { UUID } from '@robby-rabbitman/cv-libs-common-types';
import { CvStore } from '@robby-rabbitman/cv-libs-cv-data';

@Directive({
  selector: '[cv--delete-cv]',
  host: {
    '(click)': 'cvId() && cv.delete(cvId())',
  },
})
export class DeleteCv {
  protected readonly cv = inject(CvStore);

  protected readonly cvId = input<UUID>();
}
