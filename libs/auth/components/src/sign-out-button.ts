import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UserStore } from '@robby-rabbitman/cv-libs-auth-data';
import { TranslatePipe } from '@robby-rabbitman/cv-libs-i18n-features-translation';

@Component({
  selector: 'cv-auth--sign-out-button',
  imports: [MatButton, MatIcon, TranslatePipe],
  template: `<button mat-button (click)="user.signOut()">
    {{ 'auth.sign_out_button.text' | translate }}
    <mat-icon>logout</mat-icon>
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignOutButton {
  protected readonly user = inject(UserStore);
}
