import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UserStore } from '@robby-rabbitman/cv-libs-auth-data';

@Component({
  selector: 'cv-auth--sign-in-button',
  imports: [MatButton, MatIcon],
  template: `<button mat-button (click)="user.signIn()">
    auth.sign_in_button.text
    <mat-icon>login</mat-icon>
  </button>`,
})
export class SignInButton {
  protected readonly user = inject(UserStore);
}
