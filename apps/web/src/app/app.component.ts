import { Component } from '@angular/core';
import { AUTH_SMART } from '@cv/auth-smart';
import { COMMON_UI } from '@cv/common-ui';
import { I18N_SMART } from '@cv/i18n-smart';

@Component({
  standalone: true,
  imports: [COMMON_UI, AUTH_SMART, I18N_SMART],
  selector: 'cv-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
