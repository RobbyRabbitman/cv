import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { UUID } from '@cv/common/types';
import { Iso8601 } from '@cv/common/ui';
import { CvStore } from '@cv/data';
import { I18N_SMART, provideTranslatePrefix } from '@cv/i18n/smart';
import { cvRoute } from '@cv/util';
import { CvActionMenu } from './cv-action-menu';
import { EditBlockLabel } from './edit-block-label';

@Component({
  selector: 'cv-smart--card',
  standalone: true,
  viewProviders: [provideTranslatePrefix('CV.CARD')],
  template: `<span class="h-80 relative flex flex-col">
      <a [routerLink]="link()" class="control flex-1">
        <span class="sr-only">{{ 'PREVIEW.LABEL' | translate }}</span>
      </a>
      <cv-smart--action-menu class="absolute bottom-1 right-1" [cv]="cv()" />
    </span>
    <cv-smart--edit-block-label
      [cv]="cv()"
      [block]="cv()"
      [label]="'INPUT.LABEL' | translate"
      [placeholder]="'INPUT.PLACEHOLDER' | translate"
    >
      <span
        slot="after"
        [innerHTML]="
          'LAST_MODIFIED_AT'
            | translate
              : {
                  lastModifiedAt: cv().lastModifiedAt | date,
                  lastModifiedAtUTC: cv().lastModifiedAt | iso8601
                }
        "
      >
      </span>
    </cv-smart--edit-block-label>`,
  styleUrl: './cv-card.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, I18N_SMART, EditBlockLabel, Iso8601, CvActionMenu],
})
export class CvCard {
  store = inject(CvStore);

  route = cvRoute();

  link = computed(() => this.route(this.cvId()));

  cv = computed(() => this.store.cvEntityMap()[this.cvId()]);

  cvId = input.required<UUID>();
}
