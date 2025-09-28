import { computed, Directive, inject, input } from '@angular/core';
import type { UUID } from '@robby-rabbitman/cv-libs-common-types';
import { CvStore } from '@robby-rabbitman/cv-libs-cv-data';
import type { Cv } from '@robby-rabbitman/cv-libs-cv-types';

@Directive({
  selector: '[cv--delete-cv]',
  host: {
    '(click)': 'cvId() && cvStore.delete(cvId())',
  },
})
export class DeleteCv {
  protected readonly cvStore = inject(CvStore);

  protected readonly cvId = input.required<UUID>();

  readonly cv = computed(() => this.cvStore.allMap()[this.cvId()] as Cv);
}
