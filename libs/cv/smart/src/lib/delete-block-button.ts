import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { Translate } from '@cv/i18n/smart';
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
  template: `
    <span class="sr-only">
      {{
        deleteBlock.translation() + '.LABEL'
          | translate
            : { block: deleteBlock.blockTranslation() + '.LABEL' | translate }
      }}
    </span>
    <span aria-hidden="true" class="icon">delete</span>
    <span class="text-xl" aria-hidden="true">
      <ng-content>
        {{ deleteBlock.translation() + '.TEXT' | translate }}
      </ng-content>
    </span>
  `,
  styleUrl: './delete-block-button.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteBlockButton {
  protected readonly deleteBlock = inject(DeleteBlock);

  static readonly class = 'cv-smart--delete-block-button';

  delete() {
    this.deleteBlock.delete();
  }
}
