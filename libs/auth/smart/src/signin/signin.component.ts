import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserStore } from '@cv/auth-data';

@Component({
  selector: 'cv-auth-signin',
  standalone: true,
  imports: [],
  template: `<button (click)="store.signin()">--Signin--</button>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {
  protected store = inject(UserStore);
}
