import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserStore } from '@cv/auth-data';
import { AUTH_SMART } from '@cv/auth-smart';
import { CvStore } from '@cv/common-data';
import { COMMON_UI } from '@cv/common-ui';

@Component({
  standalone: true,
  imports: [COMMON_UI, AUTH_SMART, JsonPipe],
  selector: 'cv-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  cvStore = inject(CvStore);
  userStore = inject(UserStore);
}
