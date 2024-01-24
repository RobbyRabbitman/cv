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
  template: `<a [routerLink]="link()" class="control h-80">
      <span class="sr-only">{{ 'PREVIEW.LABEL' | translate }}</span>
    </a>
    <label class="flex flex-col gap-2">
      <span class="sr-only">{{ 'INPUT.LABEL' | translate }}</span>
      <input
        class="input"
        [placeholder]="placeholder()"
        [value]="value()"
        (input)="onChange($event)"
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

  link = computed(() => this.route(this.cvId()));

  cv = computed(() => this.store.cvEntityMap()[this.cvId()]);

  proto = computed(() => this.store.getPrototype(this.cvId()));

  value = computed(() => this.cv().label ?? '');

  placeholder = computed(() => {
    if (this.value() === '') return this.translate('INPUT.PLACEHOLDER');
    return '';
  });

  cvId = input.required<UUID>();

  protected onChange(event: Event) {
    this.store.patchBlock(this.cv(), {
      id: this.cv().id,
      type: 'cv',
      label: (event.target as HTMLInputElement).value,
    });
  }
}
