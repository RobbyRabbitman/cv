import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18N_SMART } from '@cv/i18n-smart';

@Component({
  selector: 'cv-common-feature--shell',
  standalone: true,
  imports: [RouterOutlet, I18N_SMART],
  templateUrl: './shell.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {}
