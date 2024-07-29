import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { CvStore } from '@cv/cv/data';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';

@Component({
  selector: 'cv-smart--create-cv-button',
  standalone: true,
  imports: [Translate],
  viewProviders: [provideTranslatePrefix('CV.CREATE_BUTTON')],
  template: `<button
    class="button h-80 w-56 items-center flex-col justify-center"
    (click)="onClick()"
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

  protected router = inject(Router);

  protected template = computed(() => this.cv.templateEntities().at(0)?.id);

  protected onClick() {
    const template = this.template();

    if (!template) return;

    this.router.navigate(['all', this.cv.create(template)]);
  }
}
