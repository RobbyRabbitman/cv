import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserStore } from '@cv/auth-data';
import { Translate } from '@cv/i18n-smart';

@Component({
  selector: 'cv-auth-sign-out-button',
  standalone: true,
  imports: [Translate],
  template: `<button (click)="store.signOut()">
    {{ 'AUTH.SIGN_OUT.BUTTON.LABEL' | translate }}
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignOutButton {
  protected store = inject(UserStore);
}
