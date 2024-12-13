import angular from '@analogjs/vite-plugin-angular';
import { vitePlugin } from '@remcovaes/web-test-runner-vite-plugin';
import { defaultReporter, summaryReporter } from '@web/test-runner';
import { defineConfig } from 'vite';

/** @type {import('@web/test-runner').TestRunnerConfig} */
export default {
  nodeResolve: true,
  coverage: true,
  coverageConfig: {
    reportDir: 'coverage',
    include: ['src/**/*'],
    threshold: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  reporters: [summaryReporter({}), defaultReporter()],
  testRunnerHtml: (testFramework) =>
    `<html>
      <body>
        <script type="module" src="test-setup.js"></script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>`,
  files: ['src/**/*.spec.*'],
  plugins: [
    vitePlugin(
      defineConfig({
        resolve: {
          mainFields: ['module'],
        },
        plugins: [angular({ tsconfig: 'tsconfig.spec.json' })],
      }),
    ),
  ],
};
