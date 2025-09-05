import { playwrightConfig } from '@robby-rabbitman/cv-tools-playwright';

const CI = !!process.env.CI;
const baseURL = !CI ? 'http://localhost:4200/' : undefined;

export default playwrightConfig({
  use: {
    baseURL,
  },
  webServer: {
    command: 'pnpm nx run @robby-rabbitman/cv-apps-web-cv:serve',
    url: baseURL,
  },
});
