import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserStore } from '@cv/auth/data';
import { AUTH_SMART } from '@cv/auth/smart';
import { CommonStore } from '@cv/common/data';
import { COMMON_SMART } from '@cv/common/smart';
import { I18N_SMART } from '@cv/i18n/smart';
import { Logo } from './logo';

@Component({
  selector: 'cv-common--shell',
  standalone: true,
  imports: [RouterOutlet, I18N_SMART, AUTH_SMART, COMMON_SMART, Logo],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  protected common = inject(CommonStore);
  protected user = inject(UserStore);
}
