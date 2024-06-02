import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { COMMON_UI_MENU } from '@cv/common/ui';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';
import { Cv } from '@cv/types';
import { DeleteCvButton } from './delete-cv-button';

@Component({
  selector: 'cv-smart--action-menu',
  standalone: true,
  imports: [DeleteCvButton, Translate, COMMON_UI_MENU],
  viewProviders: [provideTranslatePrefix('CV.ACTION.MENU')],
  template: `
    <button cv-common-ui--menu-trigger>
      <span class="sr-only">{{ '' | translate }}</span>
      <span aria-hidden="true" class="icon">more_vert</span>
      <cv-common-ui--menu>
        <button
          cv-common-ui--menu-item
          cv-smart--delete-cv-button
          [cv]="cv()"
          [block]="cv()"
        ></button>
      </cv-common-ui--menu>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvActionMenu {
  cv = input.required<Cv>();
}
