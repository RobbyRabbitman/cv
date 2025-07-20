import { NgModule, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

/**
 * A wrapper module that provides the _zoneless_ change detection strategy
 * because `platformBrowserTesting()` does not accept environment providers.
 *
 * TODO: Remove this module once `platformBrowserTesting()` accepts environment
 * providers or we can provide the zoneless strategy directly.
 */
@NgModule({
  providers: [provideZonelessChangeDetection()],
})
class ZonelessTestingModule {}

/**
 * Configures a _zoneless_ `Testbed` environment. Call this function before any
 * test runs.
 *
 * https://angular.dev/guide/zoneless#using-zoneless-in-testbed
 */
export function initZonelessTestEnvironment() {
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(
    [BrowserTestingModule, ZonelessTestingModule],
    platformBrowserTesting(),
    {
      errorOnUnknownElements: true,
      errorOnUnknownProperties: true,
    },
  );
}
