import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { UserStore } from '@cv/auth/data';
import { AUTH_SMART } from '@cv/auth/smart';
import { COMMON_SMART } from '@cv/common/smart';
import { I18N_SMART } from '@cv/i18n/smart';
import { provideCvRoute } from '@cv/util';
import { Logo } from './logo';

@Component({
  selector: 'cv-common--shell',
  standalone: true,
  imports: [I18N_SMART, AUTH_SMART, COMMON_SMART, Logo],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCvRoute((id) => id, true)],
})
export class Shell {
  protected user = inject(UserStore);
}
