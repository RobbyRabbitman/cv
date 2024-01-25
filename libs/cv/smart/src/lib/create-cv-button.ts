import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
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
    class="button h-80 w-56 items-center flex-col justify-center"
    (click)="cv.create(template()!)"
    [disabled]="cv.loading()"
  >
    <span class="text-xl">{{ 'LABEL' | translate }}</span>
    <span aria-hidden="true" class="icon !text-7xl">add_circle</span>
  </button>`,
  styleUrl: './create-cv-button.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCvButton {
  protected cv = inject(CvStore);

  protected template = computed(() => this.cv.templateEntities().at(0)?.id);
}
