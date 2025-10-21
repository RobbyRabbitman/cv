import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import {
  SignInButton,
  SignOutButton,
} from '@robby-rabbitman/cv-libs-auth-components';
import { UserStore } from '@robby-rabbitman/cv-libs-auth-data';
import { LocaleMenu } from '@robby-rabbitman/cv-libs-i18n-components';
import { TranslatePipe } from '@robby-rabbitman/cv-libs-i18n-translation';
import { Logo } from './logo';

@Component({
  selector: 'cv-common--shell',
  imports: [
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatToolbar,
    Logo,
    SignInButton,
    SignOutButton,
    LocaleMenu,
    MatIconButton,
    MatIcon,
    TranslatePipe,
    MatButton,
  ],
  host: {
    class: 'cv-common--shell absolute inset-0 flex flex-col',
  },
  template: `<mat-toolbar class="sticky z-[2]" role="banner">
      <span class="container mx-auto flex items-center">
        <button
          mat-icon-button
          (click)="sidenav.toggle()"
          aria-label="{{
            'common.shell.global_menu.toggle_button.text.' +
              (sidenav.opened ? 'close' : 'open') | translate
          }}"
        >
          <mat-icon>menu</mat-icon>
        </button>
        <cv-common--shell-logo class="me-auto" />
        <cv-i18n--locale-menu />
        @if (user.value()) {
          <cv-auth--sign-out-button />
        } @else {
          <cv-auth--sign-in-button />
        }
      </span>
    </mat-toolbar>
    <mat-sidenav-container class="flex-[1_0_auto] md:flex-1">
      <mat-sidenav
        #sidenav
        class="flex flex-col !top-14 sm:!top-16"
        fixedInViewport
        mode="over"
        role="complementary"
        aria-labelledby="cv-common--shell-global-menu-heading"
        autoFocus="first-heading"
      >
        <h2 class="sr-only" id="cv-common--shell-global-menu-heading">
          {{ 'common.shell.global_menu.text' | translate }}
        </h2>
        <button
          class="not-focus-visible:sr-only"
          mat-button
          (click)="sidenav.close()"
        >
          {{ 'common.shell.global_menu.close_button.text' | translate }}
        </button>
        <ng-content select="[slot='global-menu']" />
      </mat-sidenav>

      <mat-sidenav-content class="px-4 md:px-0 flex flex-col">
        <main class="container mx-auto">
          <ng-content select="[slot='main']" />
        </main>

        <footer class="container mx-auto">
          <ng-content select="[slot='footer']" />
        </footer>
      </mat-sidenav-content>
    </mat-sidenav-container> `,
  styleUrl: './shell.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  protected readonly user = inject(UserStore);
}
