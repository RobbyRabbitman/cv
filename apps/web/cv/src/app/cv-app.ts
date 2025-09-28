import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Shell } from '@robby-rabbitman/cv-libs-common-features-shell';

@Component({
  selector: 'cv-app',
  imports: [Shell, RouterOutlet],
  template: `<cv-common--shell>
    <router-outlet slot="global-menu" name="global-menu" />
    <router-outlet slot="main" />
    <router-outlet slot="footer" name="footer" />
  </cv-common--shell>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvApp {}
