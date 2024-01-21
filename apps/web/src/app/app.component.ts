import { Component, inject } from '@angular/core';
import { CvStore } from '@cv/common-data';
import { COMMON_UI } from '@cv/common-ui';

@Component({
  standalone: true,
  imports: [COMMON_UI],
  selector: 'cv-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  cvStore = inject(CvStore);

  constructor() {
    this.cvStore.getCv('123');
  }
}
