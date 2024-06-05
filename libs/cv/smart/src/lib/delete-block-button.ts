import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';
import { DeleteBlock } from './delete-block';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[cv-smart--delete-block-button]',
  standalone: true,
  imports: [Translate],
  host: {
    class: DeleteBlockButton.class,
  },
  hostDirectives: [{ directive: DeleteBlock, inputs: ['cv', 'block'] }],
  viewProviders: [provideTranslatePrefix('CV.DELETE_BLOCK_BUTTON')],
  template: `
    <span aria-hidden="true" class="icon">delete</span>
    <span class="text-xl">{{ 'LABEL' | translate }}</span>
  `,
  styleUrl: './delete-block-button.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteBlockButton {
  protected readonly deleteBlockDirective = inject(DeleteBlock);

  static readonly class = 'cv-smart--delete-block-button';

  delete() {
    this.deleteBlockDirective.delete();
  }
}
