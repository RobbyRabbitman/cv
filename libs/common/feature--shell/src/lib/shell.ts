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
import { CvStore } from '@cv/data';
import { I18N_SMART } from '@cv/i18n/smart';
import { CV_SMART } from '@cv/smart';
import { provideCvRoute } from '@cv/util';
import { Logo } from './logo';

@Component({
  selector: 'cv-common--shell',
  standalone: true,
  imports: [RouterOutlet, I18N_SMART, AUTH_SMART, COMMON_SMART, CV_SMART, Logo],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCvRoute((id) => id, true)],
})
export class Shell {
  protected common = inject(CommonStore);
  protected cv = inject(CvStore);
  protected user = inject(UserStore);
}
