import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserStore } from '@cv/auth-data';

@Component({
  selector: 'cv-auth-signout',
  standalone: true,
  imports: [],
  template: `<button (click)="store.signout()">--Signout--</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignoutComponent {
  protected store = inject(UserStore);
}
