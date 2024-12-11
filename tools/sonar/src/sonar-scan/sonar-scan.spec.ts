import {
  type ProjectGraph,
  readCachedProjectGraph,
  targetToTargetString,
} from '@nx/devkit';
import { getCurrentBranchName } from '@robby-rabbitman/cv-node-util';
import { spawnSync, type SpawnSyncReturns } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import { vol } from 'memfs';
import { join } from 'path';
import { scan } from 'sonarqube-scanner';
import { defaultSonarProperties, sonarScan } from './sonar-scan';

vi.mock('@nx/devkit');
vi.mock('child_process');
vi.mock('@robby-rabbitman/cv-node-util');
vi.mock('sonarqube-scanner');
vi.mock('fs', async () => {
  const memfs = await vi.importActual<typeof import('memfs')>('memfs');

  return memfs.fs;
});
vi.mock('fs/promises', async () => {
  const memfs = await vi.importActual<typeof import('memfs')>('memfs');

  return memfs.fs.promises;
});

describe('[Unit Test] sonarScan', () => {
  const workspaceRootMock = '/workspace';

  beforeEach(async () => {
    const actualNxDevkit =
      await vi.importActual<typeof import('@nx/devkit')>('@nx/devkit');

    vi.mocked(targetToTargetString).mockImplementation(
      actualNxDevkit.targetToTargetString,
    );

    vi.mocked(spawnSync).mockReturnValue({
      status: 0,
    } as SpawnSyncReturns<Buffer>);

    vi.mocked(getCurrentBranchName).mockReturnValue('some-branch-name');

    vi.mocked(readCachedProjectGraph).mockReturnValue({
      nodes: {
        'some-project': {
          type: 'app',
          name: 'some-project',
          data: {
            root: 'apps/some-project',
          },
        },
        'some-java-project': {
          type: 'app',
          name: 'some-java-project',
          data: {
            root: 'apps/some-java-project',
            targets: {
              sonar: {},
            },
          },
        },
      },
      dependencies: {},
    } satisfies ProjectGraph);

    vol.fromJSON(
      {
        'apps/some-project/tsconfig.json': '',
      },
      workspaceRootMock,
    );
  });

  afterEach(() => {
    vol.reset();
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('should throw an error if no project is found with the given name', async () => {
    await expect(
      sonarScan({
        projectName: 'nonExistentProject',
        workspaceRoot: workspaceRootMock,
      }),
    ).rejects.toThrow(
      "[sonarScan] No project found with the name 'nonExistentProject'.",
    );
  });

  describe('when a project is found with the given name', () => {
    describe('should scan', () => {
      it('with the current branch name when it is not set and it is not a pull request', () => {
        sonarScan({
          projectName: 'some-project',
          workspaceRoot: workspaceRootMock,
        });

        expect(scan).toHaveBeenCalledWith(
          expect.objectContaining({
            options: expect.objectContaining({
              'sonar.branch.name': 'some-branch-name',
            }),
          }),
        );
      });

      it('with the provided branch name', () => {
        sonarScan({
          projectName: 'some-project',
          workspaceRoot: workspaceRootMock,
          properties: {
            'sonar.branch.name': 'some-provided-branch-name',
          },
        });

        expect(scan).toHaveBeenCalledWith(
          expect.objectContaining({
            options: expect.objectContaining({
              'sonar.branch.name': 'some-provided-branch-name',
            }),
          }),
        );
      });

      it('with the pull request branch name', () => {
        sonarScan({
          projectName: 'some-project',
          workspaceRoot: workspaceRootMock,
          properties: {
            'sonar.pullrequest.branch': 'some-pull-request-branch',
          },
        });

        expect(scan).toHaveBeenCalledWith(
          expect.objectContaining({
            options: expect.not.objectContaining({
              'sonar.branch.name': 'some-branch-name',
            }),
          }),
        );
        expect(scan).toHaveBeenCalledWith(
          expect.objectContaining({
            options: expect.objectContaining({
              'sonar.pullrequest.branch': 'some-pull-request-branch',
            }),
          }),
        );
      });

      it('with properties', async () => {
        await sonarScan({
          projectName: 'some-project',
          workspaceRoot: workspaceRootMock,
          properties: {
            'sonar.token': 'some-token',
          },
        });

        expect(scan).toHaveBeenCalledWith(
          expect.objectContaining({
            options: expect.objectContaining({
              'sonar.token': 'some-token',
            }),
          }),
        );
      });

      describe('with base options', () => {
        it('sonar.scm.provider=git', async () => {
          await sonarScan({
            projectName: 'some-project',
            workspaceRoot: workspaceRootMock,
          });

          expect(scan).toHaveBeenCalledWith(
            expect.objectContaining({
              options: expect.objectContaining({
                'sonar.scm.provider': 'git',
              }),
            }),
          );
        });

        it('sonar.projectBaseDir=${workspaceRoot}/${projectDirectory}', async () => {
          await sonarScan({
            projectName: 'some-project',
            workspaceRoot: workspaceRootMock,
          });

          expect(scan).toHaveBeenCalledWith(
            expect.objectContaining({
              options: expect.objectContaining({
                'sonar.projectBaseDir': '/workspace/apps/some-project',
              }),
            }),
          );
        });

        it('sonar.projectKey=${projectName}', async () => {
          await sonarScan({
            projectName: 'some-project',
            workspaceRoot: workspaceRootMock,
          });

          expect(scan).toHaveBeenCalledWith(
            expect.objectContaining({
              options: expect.objectContaining({
                'sonar.projectKey': 'some-project',
              }),
            }),
          );
        });

        it('sonar.sourceEncoding=UTF-8', async () => {
          await sonarScan({
            projectName: 'some-project',
            workspaceRoot: workspaceRootMock,
          });

          expect(scan).toHaveBeenCalledWith(
            expect.objectContaining({
              options: expect.objectContaining({
                'sonar.sourceEncoding': 'UTF-8',
              }),
            }),
          );
        });
      });

      describe('with inferred technologies', () => {
        describe('based on file presence', () => {
          it('exact match', () => {
            sonarScan({
              projectName: 'some-project',
              workspaceRoot: workspaceRootMock,
              inferredProjectTechnologies: {
                js: ['apps/some-project/tsconfig.json'],
              },
            });

            expect(scan).toHaveBeenCalledWith(
              expect.objectContaining({
                options: expect.objectContaining({
                  /**
                   * We just check any sonar property of the js based sonar
                   * properties
                   */
                  'sonar.javascript.lcov.reportPaths': expect.anything(),
                }),
              }),
            );
          });

          it('gracefully', () => {
            sonarScan({
              projectName: 'some-project',
              workspaceRoot: workspaceRootMock,
              inferredProjectTechnologies: {
                js: ['apps/some-project/nonExistentFile'],
              },
            });

            expect(scan).not.throw();
            expect(scan).toHaveBeenCalledWith(
              expect.objectContaining({
                options: expect.not.objectContaining({
                  'sonar.javascript.lcov.reportPaths': expect.anything(),
                }),
              }),
            );
          });
        });
      });

      describe('with technology specific options', () => {
        describe('js', () => {
          it('sonar.sources=src', async () => {
            await sonarScan({
              projectName: 'some-project',
              workspaceRoot: workspaceRootMock,
              projectTechnologies: ['js'],
            });

            expect(scan).toHaveBeenCalledWith(
              expect.objectContaining({
                options: expect.objectContaining({
                  'sonar.sources': 'src',
                }),
              }),
            );
          });

          it('sonar.tests=src', async () => {
            await sonarScan({
              projectName: 'some-project',
              workspaceRoot: workspaceRootMock,
              projectTechnologies: ['js'],
            });

            expect(scan).toHaveBeenCalledWith(
              expect.objectContaining({
                options: expect.objectContaining({
                  /**
                   * @hdi-components js projects have their tests in the src
                   * directory next to the implementation unlike e.g. java
                   * projects where tests are in a tests directory.
                   */
                  'sonar.tests': 'src',
                }),
              }),
            );
          });

          it('sonar.exclusions exclude test files', async () => {
            await sonarScan({
              projectName: 'some-project',
              workspaceRoot: workspaceRootMock,
              projectTechnologies: ['js'],
            });

            expect(scan).toHaveBeenCalledWith(
              expect.objectContaining({
                options: expect.objectContaining({
                  /** We need to exclude the test files from the source file set */
                  'sonar.exclusions': [
                    'js',
                    'jsx',
                    'mjs',
                    'cjs',
                    'ts',
                    'tsx',
                    'mts',
                    'cts',
                  ]
                    .map((x) => `src/**/*.spec.${x}`)
                    .join(','),
                }),
              }),
            );
          });

          it('sonar.javascript.lcov.reportPaths=coverage/lcov.info', async () => {
            await sonarScan({
              projectName: 'some-project',
              workspaceRoot: workspaceRootMock,
              projectTechnologies: ['js'],
            });

            expect(scan).toHaveBeenCalledWith(
              expect.objectContaining({
                options: expect.objectContaining({
                  'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
                }),
              }),
            );
          });

          it('sonar.coverage.exclusions exclude test files', async () => {
            await sonarScan({
              projectName: 'some-project',
              workspaceRoot: workspaceRootMock,
              projectTechnologies: ['js'],
            });

            expect(scan).toHaveBeenCalledWith(
              expect.objectContaining({
                options: expect.objectContaining({
                  /** We need to exclude the test files from the coverage */
                  'sonar.coverage.exclusions': expect.stringContaining(
                    ['js', 'jsx', 'mjs', 'cjs', 'ts', 'tsx', 'mts', 'cts']
                      .map((x) => `src/**/*.spec.${x}`)
                      .join(','),
                  ),
                }),
              }),
            );
          });

          it('sonar.coverage.exclusions exclude storybook story files', async () => {
            await sonarScan({
              projectName: 'some-project',
              workspaceRoot: workspaceRootMock,
              projectTechnologies: ['js'],
            });

            expect(scan).toHaveBeenCalledWith(
              expect.objectContaining({
                options: expect.objectContaining({
                  /** We need to exclude the test files from the coverage */
                  'sonar.coverage.exclusions': expect.stringContaining(
                    ['js', 'jsx', 'mjs', 'cjs', 'ts', 'tsx', 'mts', 'cts']
                      .map((x) => `src/**/*.stories.${x}`)
                      .join(','),
                  ),
                }),
              }),
            );
          });

          it('sonar.test.inclusions exclude non test files', async () => {
            await sonarScan({
              projectName: 'some-project',
              workspaceRoot: workspaceRootMock,
              projectTechnologies: ['js'],
            });

            expect(scan).toHaveBeenCalledWith(
              expect.objectContaining({
                options: expect.objectContaining({
                  /**
                   * We need to include the test files to the test file set so
                   * that any non test file is excluded
                   */
                  'sonar.test.inclusions': [
                    'js',
                    'jsx',
                    'mjs',
                    'cjs',
                    'ts',
                    'tsx',
                    'mts',
                    'cts',
                  ]
                    .map((x) => `src/**/*.spec.${x}`)
                    .join(','),
                }),
              }),
            );
          });

          it('sonar.typescript.tsconfigPath=tsconfig.json', async () => {
            await sonarScan({
              projectName: 'some-project',
              workspaceRoot: workspaceRootMock,
              projectTechnologies: ['js'],
            });

            expect(scan).toHaveBeenCalledWith(
              expect.objectContaining({
                options: expect.objectContaining({
                  'sonar.typescript.tsconfigPath': 'tsconfig.json',
                }),
              }),
            );
          });

          describe('when the report file', () => {
            it('exists, add sonar.testExecutionReportPaths=coverage/execution-report.xml', async () => {
              await mkdir('/workspace/apps/some-project/coverage', {
                recursive: true,
              });
              await writeFile(
                join(
                  '/workspace/apps/some-project/coverage',
                  'execution-report.xml',
                ),
                '',
              );

              await sonarScan({
                projectName: 'some-project',
                workspaceRoot: workspaceRootMock,
                projectTechnologies: ['js'],
              });

              expect(scan).toHaveBeenCalledWith(
                expect.objectContaining({
                  options: expect.objectContaining({
                    'sonar.testExecutionReportPaths':
                      'coverage/execution-report.xml',
                  }),
                }),
              );
            });

            it('does not exist, do not add sonar.testExecutionReportPaths', async () => {
              await sonarScan({
                projectName: 'some-project',
                workspaceRoot: workspaceRootMock,
                projectTechnologies: ['js'],
              });

              expect(scan).toHaveBeenCalledWith(
                expect.not.objectContaining({
                  'sonar.testExecutionReportPaths': expect.anything(),
                }),
              );
            });
          });
        });
      });
    });
  });
});

describe('[Unit Test] defaultSonarProperties', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should return the sonarqube server for hdi components ', () => {
    expect(defaultSonarProperties()['sonar.host.url']).toEqual(
      'https://sonarcloud.io',
    );
  });

  it('should return the log level as INFO', () => {
    expect(defaultSonarProperties()['sonar.log.level']).toEqual('INFO');
  });

  it('should return verbose logging if NX_VERBOSE_LOGGING is=true', () => {
    vi.stubEnv('NX_VERBOSE_LOGGING', 'true');
    expect(defaultSonarProperties()['sonar.verbose']).toEqual('true');
  });

  it('should return non verbose logging if NX_VERBOSE_LOGGING is not set', () => {
    /**
     * We need to stub the env variable to avoid the default value set when this
     * test is run by nx
     */
    vi.stubEnv('NX_VERBOSE_LOGGING', '');
    expect(defaultSonarProperties()['sonar.verbose']).toEqual('false');
  });
});
