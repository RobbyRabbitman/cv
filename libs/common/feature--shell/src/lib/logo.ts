import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonStore } from '@cv/common/data';
import { Translate } from '@cv/i18n/smart';

@Component({
  selector: 'cv-common--shell-logo',
  standalone: true,
  imports: [RouterLink, Translate],
  template: `<a routerLink="/" class="font-bold text-4xl focus-ring">
    <span class="sr-only">
      {{
        'COMMON.FEATURES.SHELL.LOGO.LABEL'
          | translate: { appName: common.appName() }
      }}
    </span>
    <span aria-hidden="true">
      {{ common.appName() }}
    </span>
  </a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo {
  protected common = inject(CommonStore);
}