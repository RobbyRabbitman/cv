import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { UserStore } from '@robby-rabbitman/cv-libs-auth-data';
import { Logo } from './logo';

@Component({
  selector: 'cv-common--shell',
  imports: [MatToolbar, Logo],
  host: {
    class: 'cv-common--shell h-full flex flex-col items-center',
  },
  template: `<mat-toolbar role="heading">
      <span class="container mx-auto">
        <cv-common--shell-logo />
        @if (user.value()) {
          <button cv-auth--sign-out-button></button>
        } @else {
          <button cv-auth--sign-in-button></button>
        }
      </span>
    </mat-toolbar>
    <main class="container">
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
