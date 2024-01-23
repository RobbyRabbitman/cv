import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { UserStore } from '@cv/auth/data';
import { provideTranslatePrefix } from '@cv/i18n/smart';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'cv-auth-smart--sign-in-button',
  standalone: true,
  viewProviders: [provideTranslatePrefix('AUTH.SIGN_IN.BUTTON')],
  imports: [TranslateModule],
  template: `<button class="button" (click)="store.signIn()">
    <span aria-hidden="true" class="icon">login</span>
    <span class="sr-only">{{ 'LABEL' | translate }}</span>
  </button>`,
  styleUrl: './sign-in.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInButton {
  protected store = inject(UserStore);
}
