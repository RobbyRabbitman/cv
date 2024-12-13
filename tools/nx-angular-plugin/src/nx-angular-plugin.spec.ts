import { type CreateNodesContextV2, type CreateNodesResult } from '@nx/devkit';
import { vol, type DirectoryJSON } from 'memfs';
import { minimatch } from 'minimatch';
import {
  createNodesV2,
  type AngularPluginSchema,
} from './nx-angular-plugin.js';

vi.mock('fs', async () => {
  const memfs = await vi.importActual<typeof import('memfs')>('memfs');

  return memfs.fs;
});

describe('[Unit Test] infer angular targets', () => {
  /** Infer angular targets for the given directories. */
  const inferAngularTargets = async (options: {
    directories: DirectoryJSON;
    schema?: AngularPluginSchema;
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

  it("should infer 'angular.json' files", async () => {
    const nodes = await inferAngularTargets({
      directories: {
        'angular.json': '',
        'project-1/angular.json': '',
        'nested/project-2/angular.json': '',
      },
    });

    expect(nodes).toEqual([
      ['angular.json', expect.anything()],
      ['project-1/angular.json', expect.anything()],
      ['nested/project-2/angular.json', expect.anything()],
    ]);
  });

  it("should add a build target in the directory the 'angular.json' file is in", async () => {
    const nodes = await inferAngularTargets({
      directories: {
        'project-1/angular.json': '',
      },
    });

    expect(nodes).toEqual([
      [
        'project-1/angular.json',
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

  it("should add a test target in the directory the 'angular.json' file is in", async () => {
    const nodes = await inferAngularTargets({
      directories: {
        'project-1/angular.json': '',
      },
    });

    expect(nodes).toEqual([
      [
        'project-1/angular.json',
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

  it("should add a serve target in the directory the 'angular.json' file is in", async () => {
    const nodes = await inferAngularTargets({
      directories: {
        'project-1/angular.json': '',
      },
    });

    expect(nodes).toEqual([
      [
        'project-1/angular.json',
        {
          projects: {
            'project-1': expect.objectContaining({
              targets: expect.objectContaining({
                /** Default target name */
                serve: expect.anything(),
              }),
            }),
          },
        } satisfies CreateNodesResult,
      ],
    ]);
  });

  describe('build target', () => {
    it('should use the provided name when buildTargetName is provided in the schema', async () => {
      const nodes = await inferAngularTargets({
        directories: {
          'project-1/angular.json': '',
        },
        schema: {
          buildTargetName: 'custom-build-name',
        },
      });

      expect(nodes).toEqual([
        [
          'project-1/angular.json',
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
      const nodes = await inferAngularTargets({
        directories: {
          'project-1/angular.json': '',
        },
        schema: {
          buildTargetName: '',
        },
      });

      expect(nodes).toEqual([
        [
          'project-1/angular.json',
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

    it('should use ng build when no buildTargetConfiguration is provided in the schema', async () => {
      const nodes = await inferAngularTargets({
        directories: {
          'project-1/angular.json': '',
        },
      });

      expect(nodes).toEqual([
        [
          'project-1/angular.json',
          {
            projects: {
              'project-1': expect.objectContaining({
                targets: expect.objectContaining({
                  build: {
                    command: 'ng build',
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
      const nodes = await inferAngularTargets({
        directories: {
          'project-1/angular.json': '',
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
          'project-1/angular.json',
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

  describe('test target', () => {
    it('should use the provided name when testTargetName is provided in the schema', async () => {
      const nodes = await inferAngularTargets({
        directories: {
          'project-1/angular.json': '',
        },
        schema: {
          testTargetName: 'custom-test-name',
        },
      });

      expect(nodes).toEqual([
        [
          'project-1/angular.json',
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
      const nodes = await inferAngularTargets({
        directories: {
          'project-1/angular.json': '',
        },
        schema: {
          testTargetName: '',
        },
      });

      expect(nodes).toEqual([
        [
          'project-1/angular.json',
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

    it('should use ng test when no testTargetConfiguration is provided in the schema', async () => {
      const nodes = await inferAngularTargets({
        directories: {
          'project-1/angular.json': '',
        },
      });

      expect(nodes).toEqual([
        [
          'project-1/angular.json',
          {
            projects: {
              'project-1': expect.objectContaining({
                targets: expect.objectContaining({
                  test: {
                    command: 'ng test',
                    cache: true,
                    inputs: ['default', '^default'],
                    outputs: ['{projectRoot}/coverage'],
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

    it('should use the provided configuration when testTargetConfiguration is provided in the schema', async () => {
      const nodes = await inferAngularTargets({
        directories: {
          'project-1/angular.json': '',
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
          'project-1/angular.json',
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

  describe('serve target', () => {
    it('should use the provided name when serveTargetName is provided in the schema', async () => {
      const nodes = await inferAngularTargets({
        directories: {
          'project-1/angular.json': '',
        },
        schema: {
          serveTargetName: 'custom-serve-name',
        },
      });

      expect(nodes).toEqual([
        [
          'project-1/angular.json',
          {
            projects: {
              'project-1': expect.objectContaining({
                targets: expect.objectContaining({
                  'custom-serve-name': expect.anything(),
                }),
              }),
            },
          } satisfies CreateNodesResult,
        ],
      ]);
    });

    it('should use the default name of serve when serveTargetName is not provided', async () => {
      const nodes = await inferAngularTargets({
        directories: {
          'project-1/angular.json': '',
        },
        schema: {
          serveTargetName: '',
        },
      });

      expect(nodes).toEqual([
        [
          'project-1/angular.json',
          {
            projects: {
              'project-1': expect.objectContaining({
                targets: expect.objectContaining({
                  serve: expect.anything(),
                }),
              }),
            },
          } satisfies CreateNodesResult,
        ],
      ]);
    });

    it('should use ng serve when no serveTargetConfiguration is provided in the schema', async () => {
      const nodes = await inferAngularTargets({
        directories: {
          'project-1/angular.json': '',
        },
      });

      expect(nodes).toEqual([
        [
          'project-1/angular.json',
          {
            projects: {
              'project-1': expect.objectContaining({
                targets: expect.objectContaining({
                  serve: {
                    command: 'ng serve',
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

    it('should use the provided configuration when serveTargetConfiguration is provided in the schema', async () => {
      const nodes = await inferAngularTargets({
        directories: {
          'project-1/angular.json': '',
        },
        schema: {
          serveTargetConfiguration: {
            command: 'custom command',
            options: {
              custom: 'option',
            },
          },
        },
      });

      expect(nodes).toEqual([
        [
          'project-1/angular.json',
          {
            projects: {
              'project-1': expect.objectContaining({
                targets: expect.objectContaining({
                  serve: expect.objectContaining({
                    command: 'custom command',
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
