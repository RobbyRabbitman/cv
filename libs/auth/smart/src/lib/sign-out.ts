import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { UserStore } from '@cv/auth/data';
import { nativeElement } from '@cv/common/util';
import { Translate, provideTranslatePrefix } from '@cv/i18n/smart';
import { rxEffect } from 'ngxtension/rx-effect';
import { fromEvent } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[cv-auth-smart--sign-out-button]',
  standalone: true,
  viewProviders: [provideTranslatePrefix('AUTH.SIGN_OUT.BUTTON')],
  imports: [Translate],
  host: { class: 'cv-auth-smart--sign-out-button' },
  template: `
    <span>{{ 'LABEL' | translate }}</span>
    <span aria-hidden="true" class="icon">logout</span>
  `,
  styleUrl: './sign-out.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignOutButton {
  protected readonly userStore = inject(UserStore);

  readonly element = nativeElement();

  constructor() {
    this.signOutOnClick();
  }

  protected signOutOnClick() {
    rxEffect(fromEvent(this.element, 'click'), () => this.signOut());
  }

  signOut() {
    this.userStore.signOut();
  }
}
