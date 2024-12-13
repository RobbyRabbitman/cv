import { type CreateNodesContextV2, type CreateNodesResult } from '@nx/devkit';
import { type DirectoryJSON, vol } from 'memfs';
import { minimatch } from 'minimatch';
import {
  createNodesV2,
  type NgPackagrPluginSchema,
} from './nx-ng-packagr-plugin.js';

vi.mock('fs', async () => {
  const memfs = await vi.importActual<typeof import('memfs')>('memfs');

  return memfs.fs;
});

describe('[Unit Test] infer ng-packagr targets', () => {
  /** Infer ng-packagrtargets for the given directories. */
  const inferNgPackagrTargets = async (options: {
    directories: DirectoryJSON;
    schema?: NgPackagrPluginSchema;
    context?: CreateNodesContextV2;
  }) => {
    const [createNodesGlob, createNodesFn] = createNodesV2;

    const { directories, schema } = options;

    const context = {
      nxJsonConfiguration: {},
      workspaceRoot: '',
      ...options.context,
    } satisfies CreateNodesContextV2;

    vol.fromJSON(directories, context.workspaceRoot);

    return createNodesFn(
      Object.keys(directories).filter((file) =>
        minimatch(file, createNodesGlob, { dot: true }),
      ),
      schema,
      context,
    );
  };

  afterEach(() => {
    vol.reset();
    vi.resetModules();
  });

  it("should infer 'ng-package.json' files", async () => {
    const nodes = await inferNgPackagrTargets({
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

  it("should add a test target in the directory the 'ng-package.json' file is in", async () => {
    const nodes = await inferNgPackagrTargets({
      directories: {
        'project-1/ng-package.json': '',
      },
    });

    expect(nodes).toEqual([
      [
        'project-1/ng-package.json',
        {
          projects: {
            'project-1': expect.objectContaining({
              targets: expect.objectContaining({
                /** Default target name */
                test: expect.anything(),
              }),
            }),
          },
        } satisfies CreateNodesResult,
      ],
    ]);
  });

  it("should add a build target in the directory the 'ng-package.json' file is in", async () => {
    const nodes = await inferNgPackagrTargets({
      directories: {
        'project-1/ng-package.json': '',
      },
    });

    expect(nodes).toEqual([
      [
        'project-1/ng-package.json',
        {
          projects: {
            'project-1': expect.objectContaining({
              targets: expect.objectContaining({
                /** Default target name */
                build: expect.anything(),
              }),
            }),
          },
        } satisfies CreateNodesResult,
      ],
    ]);
  });

  describe('test target', () => {
    it('should use the provided name when testTargetName is provided in the schema', async () => {
      const nodes = await inferNgPackagrTargets({
        directories: {
          'project-1/ng-package.json': '',
        },
        schema: {
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

    it('should use the default name of test when testTargetName is not provided', async () => {
      const nodes = await inferNgPackagrTargets({
        directories: {
          'project-1/ng-package.json': '',
        },
        schema: {
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

    it('should use the @angular-devkit/build-angular:web-test-runner when no testTargetConfiguration is provided in the schema', async () => {
      const nodes = await inferNgPackagrTargets({
        directories: {
          'project-1/ng-package.json': '',
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
                    executor: '@angular-devkit/build-angular:web-test-runner',
                    cache: true,
                    inputs: ['default', '^default'],
                    outputs: ['{projectRoot}/coverage'],
                    options: {
                      cwd: '{projectRoot}',
                      include: ['src/**/*.spec.*'],
                      tsConfig: 'tsconfig.spec.json',
                      polyfills: ['zone.js', 'zone.js/testing'],
                    },
                  },
                }),
              }),
            },
          } satisfies CreateNodesResult,
        ],
      ]);
    });

    it('should use the provided configuration when testTargetConfiguration is provided in the schema', async () => {
      const nodes = await inferNgPackagrTargets({
        directories: {
          'project-1/ng-package.json': '',
        },
        schema: {
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
                  test: expect.objectContaining({
                    executor: 'custom-executor',
                    options: expect.objectContaining({
                      include: ['custom-include'],
                      tsConfig: 'custom-ts-config',
                      polyfills: ['custom-polyfill'],
                    }),
                  }),
                }),
              }),
            },
          } satisfies CreateNodesResult,
        ],
      ]);
    });
  });

  describe('build target', () => {
    it('should use the provided name when buildTargetName is provided in the schema', async () => {
      const nodes = await inferNgPackagrTargets({
        directories: {
          'project-1/ng-package.json': '',
        },
        schema: {
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

    it('should use the default name of build when buildTargetName is not provided', async () => {
      const nodes = await inferNgPackagrTargets({
        directories: {
          'project-1/ng-package.json': '',
        },
        schema: {
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

    it('should use the ng-packagr command when no buildTargetConfiguration is provided in the schema', async () => {
      const nodes = await inferNgPackagrTargets({
        directories: {
          'project-1/ng-package.json': '',
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
                    },
                  },
                }),
              }),
            },
          } satisfies CreateNodesResult,
        ],
      ]);
    });

    it('should use the provided configuration when buildTargetConfiguration is provided in the schema', async () => {
      const nodes = await inferNgPackagrTargets({
        directories: {
          'project-1/ng-package.json': '',
        },
        schema: {
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
                  build: expect.objectContaining({
                    command: 'custom command',
                    outputs: ['custom-output'],
                    options: {
                      cwd: '{projectRoot}',
                      custom: 'option',
                    },
                  }),
                }),
              }),
            },
          } satisfies CreateNodesResult,
        ],
      ]);
    });
  });
});
