import { defineConfig, devices } from '@playwright/test';

export const playwrightConfig = () => {
  const isCI = !!process.env.CI;

  return defineConfig({
    testDir: 'src',
    outputDir: '.test-results',
    fullyParallel: true,
    reporter: [['html', { outputFolder: '.test-reports' }]],
    use: {
      trace: 'on-first-retry',
    },
    forbidOnly: isCI,
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
  });
};
