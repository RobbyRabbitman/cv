import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UserStore } from '@robby-rabbitman/cv-libs-auth-data';
import { TranslatePipe } from '@robby-rabbitman/cv-libs-i18n-features-translation';

@Component({
  selector: 'cv-auth--sign-in-button',
  imports: [MatButton, MatIcon, TranslatePipe],
  template: `<button mat-button (click)="user.signIn()">
    {{ 'auth.sign_in_button.text' | translate }}
    <mat-icon>login</mat-icon>
  </button>`,
})
export class SignInButton {
  protected readonly user = inject(UserStore);
}
