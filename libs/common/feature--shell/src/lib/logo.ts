import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonStore } from '@cv/common/data';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';

@Component({
  selector: 'cv-common--shell-logo',
  standalone: true,
  viewProviders: [provideTranslatePrefix('COMMON.FEATURES.SHELL.LOGO')],
  imports: [RouterLink, Translate],
  template: `<a routerLink="/" class="font-bold text-4xl">
    <span class="sr-only">
      {{ 'LABEL' | translate: { appName: common.appName() } }}
    </span>
    <span aria-hidden="true">
      {{ common.appName() }}
    </span>
  </a>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo {
  protected common = inject(CommonStore);
}
