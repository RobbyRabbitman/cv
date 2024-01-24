import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { UUID } from '@cv/common/types';
import { CvStore } from '@cv/data';
import {
  I18N_SMART,
  provideTranslatePrefix,
  translateFactory,
} from '@cv/i18n/smart';
import { cvRoute } from '@cv/util';

@Component({
  selector: 'cv-smart--card',
  standalone: true,
  imports: [RouterLink, I18N_SMART],
  viewProviders: [provideTranslatePrefix('CV.CARD')],
  template: `<a [routerLink]="link()" class="control h-80"></a>
    <!-- maybe separate component -->
    <label class="flex flex-col gap-2">
      <span class="sr-only">{{ 'LABEL_INPUT.LABEL' | translate }}</span>
      <input
        class="control p-2 placeholder:italic"
        [placeholder]="placeholder()"
        [value]="value()"
        type="text"
      />
      <span>
        {{
          'LAST_MODIFIED_AT'
            | translate: { lastModifiedAt: cv().lastModifiedAt | date }
        }}
      </span>
    </label>`,
  styleUrl: './cv-card.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvCard {
  store = inject(CvStore);

  route = cvRoute();

  translate = translateFactory()();

  link = computed(() => this.route(untracked(this.cvId)));

  cv = computed(() => this.store.cvEntityMap()[this.cvId()]);

  proto = computed(() => this.store.getPrototype(this.cvId()));

  value = computed(() => this.cv().label ?? '');

  placeholder = computed(() => {
    if (this.value() === '') return this.translate('LABEL_INPUT.PLACEHOLDER');
    return '';
  });

  cvId = input.required<UUID>();
}
