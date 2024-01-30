import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { CvStore } from '@cv/data';
import { I18nStore } from '@cv/i18n/data';
import { injectParams } from 'ngxtension/inject-params';
import { CvEditor } from './editor/cv';

@Component({
  selector: 'cv--edit-page',
  standalone: true,
  imports: [CvEditor],
  templateUrl: './cv-edit-page.html',
  styleUrl: './cv-edit-page.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CvEditPage {
  protected cvStore = inject(CvStore);

  protected i18nStore = inject(I18nStore);

  protected router = inject(Router);

  constructor() {
    this.handleEmptyParam();
    this.handleError();
    this.getTranslation();
  }

  protected cvId = injectParams('cvId');

  protected cv = computed(() => {
    const cvId = this.cvId();

    if (!cvId) return;

    untracked(() => this.cvStore.getOne(cvId));

    return this.cvStore.cvEntityMap()[cvId];
  });

  // check that the prototypes exist
  protected prototypes = this.cvStore.prototypeEntityMap;

  /** Navigates to '/' when the cv id is empty or nullish. */
  protected handleEmptyParam() {
    effect(() => {
      if (!this.cvId()) untracked(() => this.router.navigateByUrl('/'));
    });
  }

  /** Gets the translation for this cv based on the locale. */
  protected getTranslation() {
    effect(() => {
      const cv = this.cv();
      const locale = this.i18nStore.locale();

      if (!cv) return;

      const translation = this.cvStore.translation(cv.templateId, locale)();

      untracked(() => {
        if (!translation) {
          this.cvStore.getTranslation({ cvTemplateId: cv.templateId, locale });
          return;
        }

        this.i18nStore.mergeTranslation(
          locale,
          translation!,
          `CV.EDIT.${cv.templateId.toUpperCase()}`,
        );
      });
    });
  }

  /** Navigates to '/' when the the associated entity of the cv id is in an error status. */
  protected handleError() {
    effect(() => {
      const cvId = this.cvId();

      if (!cvId) return;

      const status = this.cvStore.cvStatus(cvId)();

      if (status === 'error') untracked(() => this.router.navigateByUrl('/'));
    });
  }
}
