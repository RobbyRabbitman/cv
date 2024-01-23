import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserStore } from '@cv/auth/data';
import { Translate } from '@cv/i18n/smart';

@Component({
  selector: 'cv-auth--sign-out-button',
  standalone: true,
  imports: [Translate],
  template: `<button class="inline-flex" (click)="store.signOut()">
    <span aria-hidden="true" class="material-symbols-outlined">logout</span>
    <span class="sr-only">{{ 'AUTH.SIGN_OUT.BUTTON.LABEL' | translate }}</span>
  </button>`,
  styles: `
  :host {
    @apply inline-flex;
  }
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignOutButton {
  protected store = inject(UserStore);
}
