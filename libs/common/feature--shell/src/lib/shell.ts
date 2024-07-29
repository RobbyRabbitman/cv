import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { UserStore } from '@cv/auth/data';
import { AUTH_SMART } from '@cv/auth/smart';
import { COMMON_SMART } from '@cv/common/smart';
import { provideCvRoute } from '@cv/cv/util';
import { I18N_SMART } from '@cv/i18n/smart';
import { Logo } from './logo';

@Component({
  selector: 'cv-common--shell',
  standalone: true,
  imports: [I18N_SMART, AUTH_SMART, COMMON_SMART, Logo],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  host: {
    class: 'cv-common--shell',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCvRoute((id) => id, true)],
})
export class Shell {
  protected user = inject(UserStore);
}
