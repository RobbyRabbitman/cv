import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { UserStore } from '@cv/auth/data';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';

@Component({
  selector: 'cv-auth-smart--sign-in-button',
  standalone: true,
  viewProviders: [provideTranslatePrefix('AUTH.SIGN_IN.BUTTON')],
  imports: [Translate],
  template: `<button class="button" (click)="store.signIn()">
    <span>{{ 'LABEL' | translate }}</span>
    <span aria-hidden="true" class="icon">login</span>
  </button>`,
  styleUrl: './sign-in.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInButton {
  protected store = inject(UserStore);
}
