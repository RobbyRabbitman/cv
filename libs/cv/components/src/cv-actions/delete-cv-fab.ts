import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@robby-rabbitman/cv-libs-i18n-translation';
import { DeleteCv } from './delete-cv';

@Component({
  selector: 'cv--delete-cv-fab',
  imports: [MatIcon, MatMiniFabButton, TranslatePipe],
  hostDirectives: [
    {
      directive: DeleteCv,
      inputs: ['cvId'],
    },
  ],
  template: `<button mat-mini-fab aria-label="{{ 'cv.document' | translate }}">
    <mat-icon>delete</mat-icon>
  </button>`,
  styleUrl: './delete-cv-fab.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCvFab {}
