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
import { EditBlockLabel } from './edit-block-label';

@Component({
  selector: 'cv-smart--card',
  standalone: true,
  imports: [RouterLink, I18N_SMART, EditBlockLabel, Iso8601],
  viewProviders: [provideTranslatePrefix('CV.CARD')],
  template: `<a [routerLink]="link()" class="control !h-80">
      <span class="sr-only">{{ 'PREVIEW.LABEL' | translate }}</span>
    </a>
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
})
export class CvCard {
  store = inject(CvStore);

  route = cvRoute();

  link = computed(() => this.route(this.cvId()));

  cv = computed(() => this.store.cvEntityMap()[this.cvId()]);

  cvId = input.required<UUID>();
}
