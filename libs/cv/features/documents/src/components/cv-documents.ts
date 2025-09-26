import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { CvStore } from '@robby-rabbitman/cv-libs-cv-data';
import { DatePipe } from '@robby-rabbitman/cv-libs-i18n-components';
import { TranslatePipe } from '@robby-rabbitman/cv-libs-i18n-features-translation';

@Component({
  selector: 'cv--documents',
  imports: [MatButton, MatDivider, DatePipe, TranslatePipe],
  host: {
    role: 'list',
    class:
      'list-none grid grid-cols-1 min-[35rem]:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6',
  },
  styleUrl: './cv-documents.scss',
  template: `@for (cv of cv.all.value(); track cv.id) {
    @let descriptionId = 'cv--documents__description--' + cv.id;
    <li class="w-fit">
      <button
        matButton="outlined"
        class="aspect-square"
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
    </li>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CvDocuments {
  protected cv = inject(CvStore);
}
