import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { UserStore } from '@cv/auth/data';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';

@Component({
  selector: 'cv-auth-smart--sign-out-button',
  standalone: true,
  viewProviders: [provideTranslatePrefix('AUTH.SIGN_OUT.BUTTON')],
  imports: [Translate],
  template: `<button class="button" (click)="store.signOut()">
    <span aria-hidden="true" class="icon">logout</span>
    <span class="sr-only">{{ 'LABEL' | translate }}</span>
  </button>`,
  styleUrl: './sign-out.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignOutButton {
  protected store = inject(UserStore);
}
