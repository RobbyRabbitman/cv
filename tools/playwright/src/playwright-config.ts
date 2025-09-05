import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
} from '@playwright/test';

export function playwrightConfig(config?: Partial<PlaywrightTestConfig>) {
  const CI = !!process.env.CI;

  return defineConfig({
    testDir: 'src',
    outputDir: '.test-results',
    fullyParallel: true,
    reporter: [['html', { outputFolder: '.test-reports' }]],
    use: {
      trace: 'on-first-retry',
      ...config?.use,
    },
    forbidOnly: CI,
    tsconfig: 'tsconfig.lib.json',
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },
    ],
    ...config,
  });
}
