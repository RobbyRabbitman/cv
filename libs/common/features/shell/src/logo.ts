import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@robby-rabbitman/cv-libs-i18n-translation';

@Component({
  selector: 'cv-common--shell-logo',
  imports: [RouterLink, MatButton, TranslatePipe],
  template: `<a
    routerLink="/"
    mat-button
    aria-label="{{ 'common.shell.logo.text' | translate }}"
  >
    EasyCv
  </a>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo {}
