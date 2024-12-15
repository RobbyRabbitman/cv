import {
  NgModule,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

@NgModule({
  providers: [provideExperimentalZonelessChangeDetection()],
})
class ZonelessTestingModule {}

export function initZonelessTestEnvironment() {
  /** Reset any existing test environment. */
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(
    [BrowserDynamicTestingModule, ZonelessTestingModule],
    platformBrowserDynamicTesting(),
    {
      errorOnUnknownElements: true,
      errorOnUnknownProperties: true,
    },
  );
}
