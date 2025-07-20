import { type CreateNodesContextV2, type CreateNodesResult } from '@nx/devkit';
import { type DirectoryJSON, vol } from 'memfs';
import { minimatch } from 'minimatch';
import { createNodesV2 } from './plugin.js';

vi.mock('fs', async () => {
  const memfs = await vi.importActual<typeof import('memfs')>('memfs');

  return memfs.fs;
});

describe('[Unit Test] ng-packagr plugin', () => {
  const invokeCreateNodes = async ({
    directories,
    options,
  }: {
    directories: DirectoryJSON;
    options?: Parameters<(typeof createNodesV2)[1]>[1];
  }) => {
    const [createNodesGlob, createNodesFn] = createNodesV2;

    const context = {
      nxJsonConfiguration: {},
      workspaceRoot: '',
    } satisfies CreateNodesContextV2;

    vol.fromJSON(directories, context.workspaceRoot);

    return createNodesFn(
      Object.keys(directories).filter((file) =>
        minimatch(file, createNodesGlob, { dot: true }),
      ),
      options,
      context,
    );
  };

  afterEach(() => {
    vol.reset();
  });

  describe('inferring targets', () => {
    it("should infer 'ng-package.json' files", async () => {
      const nodes = await invokeCreateNodes({
        directories: {
          'ng-package.json': '',
          'project-1/ng-package.json': '',
          'nested/project-2/ng-package.json': '',
        },
      });

      expect(nodes).toEqual([
        ['ng-package.json', expect.anything()],
        ['project-1/ng-package.json', expect.anything()],
        ['nested/project-2/ng-package.json', expect.anything()],
      ]);
    });

    it('should add a build target in a npm project', async () => {
      const nodes = await invokeCreateNodes({
        directories: {
          'project-1/ng-package.json': '',
          'project-1/package.json': '',
        },
      });

      expect(nodes).toEqual([
        [
          'project-1/ng-package.json',
          {
            projects: {
              'project-1': expect.objectContaining({
                targets: expect.objectContaining({
                  build: expect.anything(),
                }),
              }),
            },
          } satisfies CreateNodesResult,
        ],
      ]);
    });

    it('should add a test target in a npm project', async () => {
      const nodes = await invokeCreateNodes({
        directories: {
          'project-1/ng-package.json': '',
          'project-1/package.json': '',
        },
      });

      expect(nodes).toEqual([
        [
          'project-1/ng-package.json',
          {
            projects: {
              'project-1': expect.objectContaining({
                targets: expect.objectContaining({
                  test: expect.anything(),
                }),
              }),
            },
          } satisfies CreateNodesResult,
        ],
      ]);
    });

    it('should not add targets in a npm project for secondary entry points', async () => {
      const nodes = await invokeCreateNodes({
        directories: {
          'project-1/ng-package.json': '',
          'project-1/package.json': '',
          'project-1/src/some-entry-point/ng-package.json': '',
        },
      });

      expect(nodes).toEqual([
        [
          'project-1/ng-package.json',
          {
            projects: {
              'project-1': {
                targets: {
                  build: expect.anything(),
                  test: expect.anything(),
                },
              },
            },
          } satisfies CreateNodesResult,
        ],
        [
          'project-1/src/some-entry-point/ng-package.json',
          {} satisfies CreateNodesResult,
        ],
      ]);
    });
  });

  describe('inferred targets', () => {
    describe('test', () => {
      describe('name', () => {
        it('should use `test` per default', async () => {
          const nodes = await invokeCreateNodes({
            directories: {
              'project-1/ng-package.json': '',
              'project-1/package.json': '',
            },
            options: {
              testTargetName: '',
            },
          });

          expect(nodes).toEqual([
            [
              'project-1/ng-package.json',
              {
                projects: {
                  'project-1': expect.objectContaining({
                    targets: expect.objectContaining({
                      test: expect.anything(),
                    }),
                  }),
                },
              } satisfies CreateNodesResult,
            ],
          ]);
        });
        it('should use the provided value', async () => {
          const nodes = await invokeCreateNodes({
            directories: {
              'project-1/ng-package.json': '',
              'project-1/package.json': '',
            },
            options: {
              testTargetName: 'custom-test-name',
            },
          });

          expect(nodes).toEqual([
            [
              'project-1/ng-package.json',
              {
                projects: {
                  'project-1': expect.objectContaining({
                    targets: expect.objectContaining({
                      'custom-test-name': expect.anything(),
                    }),
                  }),
                },
              } satisfies CreateNodesResult,
            ],
          ]);
        });
      });

      describe('configuration', () => {
        it('should use the `@angular-devkit/build-angular:karma` per default', async () => {
          const nodes = await invokeCreateNodes({
            directories: {
              'project-1/ng-package.json': '',
              'project-1/package.json': '',
            },
          });

          expect(nodes).toEqual([
            [
              'project-1/ng-package.json',
              {
                projects: {
                  'project-1': expect.objectContaining({
                    targets: expect.objectContaining({
                      test: {
                        executor: '@angular-devkit/build-angular:karma',
                        cache: true,
                        inputs: ['default', '^default'],
                        outputs: ['{projectRoot}/coverage'],
                        options: {
                          tsConfig: '{projectRoot}/tsconfig.spec.json',
                        },
                      },
                    }),
                  }),
                },
              } satisfies CreateNodesResult,
            ],
          ]);
        });

        it('should use the provided configuration', async () => {
          const nodes = await invokeCreateNodes({
            directories: {
              'project-1/ng-package.json': '',
              'project-1/package.json': '',
            },
            options: {
              testTargetConfiguration: {
                executor: 'custom-executor',
                options: {
                  include: ['custom-include'],
                  tsConfig: 'custom-ts-config',
                  polyfills: ['custom-polyfill'],
                },
              },
            },
          });

          expect(nodes).toEqual([
            [
              'project-1/ng-package.json',
              {
                projects: {
                  'project-1': expect.objectContaining({
                    targets: expect.objectContaining({
                      test: {
                        executor: 'custom-executor',
                        cache: true,
                        inputs: ['default', '^default'],
                        outputs: ['{projectRoot}/coverage'],
                        options: {
                          include: ['custom-include'],
                          tsConfig: 'custom-ts-config',
                          polyfills: ['custom-polyfill'],
                        },
                      },
                    }),
                  }),
                },
              } satisfies CreateNodesResult,
            ],
          ]);
        });
      });
    });

    describe('build', () => {
      describe('name', () => {
        it('should use `build` per default', async () => {
          const nodes = await invokeCreateNodes({
            directories: {
              'project-1/ng-package.json': '',
              'project-1/package.json': '',
            },
            options: {
              buildTargetName: '',
            },
          });

          expect(nodes).toEqual([
            [
              'project-1/ng-package.json',
              {
                projects: {
                  'project-1': expect.objectContaining({
                    targets: expect.objectContaining({
                      build: expect.anything(),
                    }),
                  }),
                },
              } satisfies CreateNodesResult,
            ],
          ]);
        });

        it('should use the provided value', async () => {
          const nodes = await invokeCreateNodes({
            directories: {
              'project-1/ng-package.json': '',
              'project-1/package.json': '',
            },
            options: {
              buildTargetName: 'custom-build-name',
            },
          });

          expect(nodes).toEqual([
            [
              'project-1/ng-package.json',
              {
                projects: {
                  'project-1': expect.objectContaining({
                    targets: expect.objectContaining({
                      'custom-build-name': expect.anything(),
                    }),
                  }),
                },
              } satisfies CreateNodesResult,
            ],
          ]);
        });
      });

      describe('configuration', () => {
        it('should use `ng-packagr` per default', async () => {
          const nodes = await invokeCreateNodes({
            directories: {
              'project-1/ng-package.json': '',
              'project-1/package.json': '',
            },
          });

          expect(nodes).toEqual([
            [
              'project-1/ng-package.json',
              {
                projects: {
                  'project-1': expect.objectContaining({
                    targets: expect.objectContaining({
                      build: {
                        command: 'ng-packagr',
                        cache: true,
                        inputs: ['default', '^default'],
                        outputs: ['{projectRoot}/dist'],
                        options: {
                          cwd: '{projectRoot}',
                          config: 'tsconfig.lib.json',
                        },
                      },
                    }),
                  }),
                },
              } satisfies CreateNodesResult,
            ],
          ]);
        });

        it('should use the provided configuration', async () => {
          const nodes = await invokeCreateNodes({
            directories: {
              'project-1/ng-package.json': '',
              'project-1/package.json': '',
            },
            options: {
              buildTargetConfiguration: {
                command: 'custom command',
                outputs: ['custom-output'],
                options: {
                  custom: 'option',
                },
              },
            },
          });

          expect(nodes).toEqual([
            [
              'project-1/ng-package.json',
              {
                projects: {
                  'project-1': expect.objectContaining({
                    targets: expect.objectContaining({
                      build: {
                        command: 'custom command',
                        cache: true,
                        inputs: ['default', '^default'],
                        outputs: ['custom-output'],
                        options: {
                          cwd: '{projectRoot}',
                          custom: 'option',
                          config: 'tsconfig.lib.json',
                        },
                      },
                    }),
                  }),
                },
              } satisfies CreateNodesResult,
            ],
          ]);
        });
      });
    });
  });
});
