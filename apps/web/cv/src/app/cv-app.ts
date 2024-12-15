import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { COMMON_SHELL_FEATURE } from '@robby-rabbitman/cv-libs-common-feature--shell';

@Component({
  selector: 'cv',
  template: `
    <cv-common--feature-shell--shell>
      <router-outlet />
    </cv-common--feature-shell--shell>
  `,
  imports: [COMMON_SHELL_FEATURE, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvApp {}
