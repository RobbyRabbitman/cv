import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UserStore } from '@robby-rabbitman/cv-libs-auth-data';

@Component({
  selector: 'cv-auth--sign-out-button',
  imports: [MatButton, MatIcon],
  template: `<button mat-button (click)="user.signOut()">
    auth.sign_out_button.text
    <mat-icon>logout</mat-icon>
  </button>`,
})
export class SignOutButton {
  protected readonly user = inject(UserStore);
}
