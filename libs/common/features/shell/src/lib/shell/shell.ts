import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonStore } from '@cv/common-data';
import { I18N_SMART } from '@cv/i18n-smart';
import { Logo } from '../logo/logo';

@Component({
  selector: 'cv-common-feature--shell',
  standalone: true,
  imports: [RouterOutlet, I18N_SMART, Logo],
  templateUrl: './shell.html',
  styles: `
    :host {
      @apply antialiased flex flex-col items-center absolute inset-0 bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-400;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  protected common = inject(CommonStore);
}
