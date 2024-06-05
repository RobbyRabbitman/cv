import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { COMMON_SHELL_FEATURE } from '@cv/common--shell';

@Component({
  standalone: true,
  imports: [COMMON_SHELL_FEATURE, RouterOutlet],
  selector: 'cv-app',
  template: `<cv-common--shell><router-outlet hidden /></cv-common--shell>`,
})
export class App {}

@Component({
  standalone: true,
  selector: 'cv-app--welcome',
  template: `Welcome!`,
})
export class WelcomePage {}
