import { type CreateNodesContextV2, type CreateNodesResult } from '@nx/devkit';
import { type DirectoryJSON, vol } from 'memfs';
import { minimatch } from 'minimatch';
import {
  createNodesV2,
  type SonarScanPluginSchema,
  type SonarScanTargetConfiguration,
} from './nx-sonar-scan-plugin.js';

vi.mock('fs', async () => {
  const memfs = await vi.importActual<typeof import('memfs')>('memfs');

  return memfs.fs;
});

describe('[Unit Test] infer sonar scan targets', () => {
  /** Infer sonar scan targets for the given directories. */
  const inferSonarScanTargets = async (options: {
    directories: DirectoryJSON;
    schema?: SonarScanPluginSchema;
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

  it("should infer 'sonar-project.properties' files", async () => {
    const nodes = await inferSonarScanTargets({
      directories: {
        'sonar-project.properties': '',
        'project-1/sonar-project.properties': '',
        'nested/project-2/sonar-project.properties': '',
      },
    });

    expect(nodes).toEqual([
      ['sonar-project.properties', expect.anything()],
      ['project-1/sonar-project.properties', expect.anything()],
      ['nested/project-2/sonar-project.properties', expect.anything()],
    ]);
  });

  it("should add a target in the directory that the 'sonar-project.properties' file is in", async () => {
    const nodes = await inferSonarScanTargets({
      directories: {
        'project-1/sonar-project.properties': '',
      },
    });

    expect(nodes).toEqual([
      [
        'project-1/sonar-project.properties',
        {
          projects: {
            'project-1': expect.objectContaining({
              targets: expect.objectContaining({
                /** Default target name */
                'sonar-scan': expect.anything(),
              }),
            }),
          },
        } satisfies CreateNodesResult,
      ],
    ]);
  });

  it('should invoke the exec-sonar-scan-cli target of tools-sonar', async () => {
    const nodes = await inferSonarScanTargets({
      directories: {
        'project-1/sonar-project.properties': '',
      },
    });

    expect(nodes).toEqual([
      [
        'project-1/sonar-project.properties',
        {
          projects: {
            'project-1': expect.objectContaining({
              targets: expect.objectContaining({
                'sonar-scan': expect.objectContaining({
                  command:
                    'npx nx run @robby-rabbitman/cv-tools-sonar:exec-sonar-scan-cli',
                } satisfies SonarScanTargetConfiguration),
              }),
            }),
          },
        } satisfies CreateNodesResult,
      ],
    ]);
  });

  it("should use the provided name when 'sonarScanTargetName' is provided in the schema ", async () => {
    const nodes = await inferSonarScanTargets({
      directories: {
        'project-1/sonar-project.properties': '',
      },
      schema: {
        sonarScanTargetName: 'custom-sonar-scan-name',
      },
    });

    expect(nodes).toEqual([
      [
        'project-1/sonar-project.properties',
        {
          projects: {
            'project-1': expect.objectContaining({
              targets: expect.objectContaining({
                'custom-sonar-scan-name': expect.anything(),
              }),
            }),
          },
        } satisfies CreateNodesResult,
      ],
    ]);
  });

  it("should use the default name of 'sonar scan' when 'sonarScanTargetName' is not provided", async () => {
    const nodes = await inferSonarScanTargets({
      directories: {
        'project-1/sonar-project.properties': '',
      },
      schema: {
        sonarScanTargetName: '',
      },
    });

    expect(nodes).toEqual([
      [
        'project-1/sonar-project.properties',
        {
          projects: {
            'project-1': expect.objectContaining({
              targets: expect.objectContaining({
                'sonar-scan': expect.anything(),
              }),
            }),
          },
        } satisfies CreateNodesResult,
      ],
    ]);
  });

  it("should use the provided configuration when 'sonarScanTargetConfiguration' is provided in the schema", async () => {
    const nodes = await inferSonarScanTargets({
      directories: {
        'project-1/sonar-project.properties': '',
      },
      schema: {
        sonarScanTargetConfiguration: {
          options: {
            projectName: 'project-1',
          },
        },
      },
    });

    expect(nodes).toEqual([
      [
        'project-1/sonar-project.properties',
        {
          projects: {
            'project-1': expect.objectContaining({
              targets: expect.objectContaining({
                'sonar-scan': expect.objectContaining({
                  options: expect.objectContaining({
                    projectName: 'project-1',
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
