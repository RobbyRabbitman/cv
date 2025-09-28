import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { DeleteCvFab } from '@robby-rabbitman/cv-libs-cv-components';
import { CvStore } from '@robby-rabbitman/cv-libs-cv-data';
import { DatePipe } from '@robby-rabbitman/cv-libs-i18n-components';
import { TranslatePipe } from '@robby-rabbitman/cv-libs-i18n-translation';

@Component({
  selector: 'cv--documents',
  imports: [MatButton, MatDivider, DatePipe, TranslatePipe, DeleteCvFab],
  host: {
    role: 'list',
    class:
      'list-none grid grid-cols-1 min-[35rem]:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6',
  },
  styleUrl: './cv-documents.scss',
  template: `@for (cv of cv.all.value(); track cv.id) {
    @let descriptionId = 'cv--documents__description--' + cv.id;
    <li class="relative group">
      <button
        matButton="outlined"
        class="cv--documents__edit-button aspect-square w-full"
        [attr.aria-label]="
          'cv.documents.edit_button.text' | translate: { name: cv.label }
        "
        [attr.aria-describedby]="descriptionId"
      >
        <span aria-hidden="true" class="h-full flex flex-col gap-2 py-4">
          <span class="flex-1">
            <!-- cv thumb here -->
          </span>
          <mat-divider />
          <span class="flex flex-col gap-2">
            <span>{{ cv.label }}</span>
            <span [id]="descriptionId">
              {{
                'cv.documents.last_modified_at'
                  | translate
                    : {
                        lastModifiedAt: cv.lastModifiedAt | date,
                      }
              }}
            </span>
          </span>
        </span>
      </button>
      <cv--delete-cv-fab
        [cvId]="cv.id"
        (click)="$event.stopPropagation()"
        class="invisible group-focus-within:visible group-hover:visible absolute right-4 top-4 z-1"
      />
    </li>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CvDocuments {
  protected cv = inject(CvStore);
}
