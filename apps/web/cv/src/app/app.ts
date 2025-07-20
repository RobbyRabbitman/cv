import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cv',
  template: `<h1 class="bg-red-400">Welcome to CV App!</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvApp {}
