import cvWebApp from '@robby-rabbitman/cv-apps-web-cv/package.json' with { type: 'json' };
import { playwrightConfig } from '@robby-rabbitman/cv-tools-playwright';

const CI = !!process.env.CI;
const baseURL = !CI
  ? `http://localhost:${cvWebApp.nx.targets.serve.options.port}/`
  : undefined;

export default playwrightConfig({
  use: {
    baseURL,
  },
  webServer: {
    name: cvWebApp.name,
    command: `pnpm nx run ${cvWebApp.name}:serve`,
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: !CI,
  },
});
