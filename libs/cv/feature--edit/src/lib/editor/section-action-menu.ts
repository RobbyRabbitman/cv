import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { COMMON_UI_MENU } from '@cv/common/ui';
import { CV_SMART } from '@cv/cv/smart';
import { Cv, Section } from '@cv/cv/types';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';

@Component({
  selector: 'cv-edit--section-editor-action-menu',
  standalone: true,
  imports: [CV_SMART, Translate, COMMON_UI_MENU],
  viewProviders: [provideTranslatePrefix('CV.EDITOR.SECTION.ACTION_MENU')],
  template: `
    <button cv-common-ui--menu-trigger>
      <span class="sr-only">{{ 'LABEL' | translate }}</span>
      <span aria-hidden="true" class="icon">more_vert</span>
      <cv-common-ui--menu>
        <button
          cv-common-ui--menu-item
          cv-smart--delete-block-button
          [cv]="cv()"
          [block]="section()"
        ></button>
      </cv-common-ui--menu>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionEditorActionMenu {
  cv = input.required<Cv>();
  section = input.required<Section>();
}
