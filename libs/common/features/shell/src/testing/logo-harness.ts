import { ComponentHarness } from '@angular/cdk/testing';
import { reflectComponentType } from '@angular/core';
import { Logo } from '@robby-rabbitman/cv-libs-common-features-shell';

export class LogoHarness extends ComponentHarness {
  static hostSelector = reflectComponentType(Logo)?.selector;
}
