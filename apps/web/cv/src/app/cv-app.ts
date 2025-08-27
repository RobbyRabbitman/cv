import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Shell } from '@robby-rabbitman/cv-libs-common-features-shell';

@Component({
  selector: 'cv-app',
  imports: [Shell, RouterOutlet],
  host: {
    class: 'h-dvh',
  },
  template: `<cv-common--shell>
    <router-outlet />
  </cv-common--shell>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvApp {}
