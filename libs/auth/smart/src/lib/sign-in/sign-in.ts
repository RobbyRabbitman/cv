import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserStore } from '@cv/auth-data';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'cv-auth--sign-in-button',
  standalone: true,
  imports: [TranslateModule],
  template: `<button (click)="store.signIn()">
    {{ 'AUTH.SIGN_IN.BUTTON.LABEL' | translate }}
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInButton {
  protected store = inject(UserStore);
}
