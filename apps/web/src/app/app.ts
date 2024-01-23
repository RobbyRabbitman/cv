import { Component } from '@angular/core';
import { COMMON_SHELL_FEATURE } from '@cv/common--shell';

@Component({
  standalone: true,
  imports: [COMMON_SHELL_FEATURE],
  selector: 'cv-app',
  template: `<cv-common--shell />`,
})
export class App {}
