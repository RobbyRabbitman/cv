import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CvStore } from '@robby-rabbitman/cv-libs-cv-data';
import { TranslatePipe } from '@robby-rabbitman/cv-libs-i18n-features-translation';

@Component({
  selector: 'cv--create-cv-button',
  imports: [MatButton, TranslatePipe, MatIcon],
  template: `<button
    [disabled]="!cv.ready()"
    matButton="filled"
    (click)="createCv()"
  >
    <mat-icon>add_circle</mat-icon>
    {{ 'cv.create_cv_button.text' | translate }}
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCvButton {
  protected readonly cv = inject(CvStore);

  protected createCv() {
    const cvTemplate = this.cv.defaultTemplate();

    if (!cvTemplate) {
      return;
    }

    this.cv.create(cvTemplate.id);
  }
}
