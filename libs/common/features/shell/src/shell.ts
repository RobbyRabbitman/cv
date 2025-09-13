import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import {
  SignInButton,
  SignOutButton,
} from '@robby-rabbitman/cv-libs-auth-components';
import { UserStore } from '@robby-rabbitman/cv-libs-auth-data';
import { LocaleMenu } from '@robby-rabbitman/cv-libs-i18n-components';
import { Logo } from './logo';

@Component({
  selector: 'cv-common--shell',
  imports: [MatToolbar, Logo, SignInButton, SignOutButton, LocaleMenu],
  host: {
    class: 'cv-common--shell h-full flex flex-col items-center',
  },
  template: `<mat-toolbar role="heading">
      <span class="container mx-auto flex items-center">
        <cv-common--shell-logo class="me-auto" />
        <cv-i18n--locale-menu />
        @if (user.value()) {
          <cv-auth--sign-out-button />
        } @else {
          <cv-auth--sign-in-button />
        }
      </span>
    </mat-toolbar>
    <main class="container px-4 sm:px-0">
      <ng-content />
    </main>
    <footer role="contentinfo"></footer>`,
  styleUrl: './shell.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  protected readonly user = inject(UserStore);
}
