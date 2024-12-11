import { hideBin } from 'yargs/helpers';
import { sonarScan } from './sonar-scan.js';

vi.mock('yargs/helpers');
vi.mock('./sonar-scan.js');
vi.mock('@nx/devkit', () => ({
  workspaceRoot: '/some/workspace',
  logger: {
    verbose: vi.fn(),
    error: vi.fn(),
  },
}));

describe('[Unit Test] sonarScanCli', () => {
  const invokeSonarScanCli = async (args?: string) => {
    vi.spyOn(process, 'exit').mockImplementationOnce(() => undefined as never);
    vi.mocked(hideBin).mockReturnValue(
      (args ?? '--projectName some-project').split(' '),
    );

    await vi.importActual('./sonar-scan.cli.js');
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('should work', async () => {
    await invokeSonarScanCli();

    expect(process.exit).toHaveBeenCalledWith(0);
  });

  it('should require a project name', async () => {
    await invokeSonarScanCli('');

    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should forward sonar properties', async () => {
    await invokeSonarScanCli(
      '--projectName some-project --option sonar.token=my-token',
    );

    await import('./sonar-scan.cli.js');

    expect(sonarScan).toHaveBeenCalledWith(
      expect.objectContaining({
        properties: expect.objectContaining({
          'sonar.token': 'my-token',
        }),
      }),
    );
  });

  it('should parse inferred project technologies', async () => {
    await invokeSonarScanCli(
      '--projectName some-project --inferredProjectTechnology js=vitest.config.ts',
    );

    await import('./sonar-scan.cli.js');

    expect(sonarScan).toHaveBeenCalledWith(
      expect.objectContaining({
        inferredProjectTechnologies: {
          js: ['vitest.config.ts'],
        },
      }),
    );
  });
});
