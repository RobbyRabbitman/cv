import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';
import { DeleteBlockDirective } from './delete-block';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[cv-smart--delete-cv-button]',
  standalone: true,
  imports: [Translate],
  host: {
    class: DeleteCvButton.class,
  },
  hostDirectives: [
    { directive: DeleteBlockDirective, inputs: ['cv', 'block'] },
  ],
  viewProviders: [provideTranslatePrefix('CV.DELETE_CV_BUTTON')],
  template: `
    <span aria-hidden="true" class="icon">delete</span>
    <span class="text-xl">{{ 'LABEL' | translate }}</span>
  `,
  styleUrl: './delete-cv-button.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCvButton {
  protected readonly deleteBlockDirective = inject(DeleteBlockDirective);

  static readonly class = 'cv-smart--delete-cv-button';

  delete() {
    this.deleteBlockDirective.delete();
  }
}
