import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CvStore } from '@cv/data';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';

@Component({
  selector: 'cv-smart--create-cv-button',
  standalone: true,
  imports: [Translate],
  viewProviders: [provideTranslatePrefix('CV.CREATE_BUTTON')],
  template: `<button
    class="button"
    (click)="cv.create()"
    [disabled]="cv.loading()"
  >
    {{ 'LABEL' | translate }}
    <span aria-hidden="true" class="icon">add_circle</span>
  </button>`,
  styleUrl: './create-cv-button.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCvButton {
  protected cv = inject(CvStore);
}
