import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserStore } from '@cv/auth/data';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'cv-auth--sign-in-button',
  standalone: true,
  imports: [TranslateModule],
  template: `<button class="inline-flex" (click)="store.signIn()">
    <span aria-hidden="true" class="material-symbols-outlined">login</span>
    <span class="sr-only">{{ 'AUTH.SIGN_IN.BUTTON.LABEL' | translate }}</span>
  </button>`,
  styles: `
  :host {
    @apply inline-flex;
  }
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInButton {
  protected store = inject(UserStore);
}
