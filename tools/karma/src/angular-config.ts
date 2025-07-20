import type { ConfigOptions } from 'karma';

/**
 * A base karma configuration for angular projects - extends `ng generate config
 * karma` with:
 *
 * - Coverage
 * - ChromeHeadlessNoSandbox for ci
 *
 * @see {@link https://angular.dev/guide/testing#configuration}
 */
export function angularKarmaConfig(options?: {
  thresholds?: {
    statements?: number;
    branches?: number;
    functions?: number;
    lines?: number;
  };
}): ConfigOptions {
  const { thresholds } = options ?? {};

  const karmaConfig = {
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter',
      'karma-coverage',
      '@angular-devkit/build-angular/plugins/karma',
    ],
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: 'coverage',
      subdir: '.',
      reporters: [{ type: 'lcov' }, { type: 'text-summary' }],
      check: {
        global: {
          ...thresholds,
          statements: 95,
          branches: 95,
          functions: 95,
          lines: 95,
        },
      },
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome', 'ChromeHeadlessNoSandbox'],
    customLaunchers: {
      /**
       * We add a custom launcher to run Chrome headless without sandboxing so
       * that a root user can launch it.
       */
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    restartOnFileChange: true,
  };

  return karmaConfig;
}
