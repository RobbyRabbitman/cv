import { ComponentHarness } from '@angular/cdk/testing';

export class LogoHarness extends ComponentHarness {
  static hostSelector = 'cv-common--shell-logo';

  async text() {
    return (await this.host()).text();
  }
}
