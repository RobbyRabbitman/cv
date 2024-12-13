import {
  type CreateNodesFunction,
  type CreateNodesV2,
  type TargetConfiguration,
  createNodesFromFiles,
} from '@nx/devkit';
import { dirname } from 'path';

export type AngularPluginSchema = Partial<AngularPluginOptions>;

export interface AngularPluginOptions {
  buildTargetName: string;
  buildTargetConfiguration?: TargetConfiguration;
  serveTargetName: string;
  serveTargetConfiguration?: TargetConfiguration;
  testTargetName: string;
  testTargetConfiguration?: TargetConfiguration;
}

const ANGULAR_CONFIG_FILE_NAME = 'angular.json';
const ANGULAR_CONFIG_GLOB = `**/${ANGULAR_CONFIG_FILE_NAME}`;

/** https://nx.dev/extending-nx/recipes/project-graph-plugins */
export const createNodesV2 = [
  ANGULAR_CONFIG_GLOB,
  (angularConfigPaths, schema, context) =>
    createNodesFromFiles(
      createAngularTargets,
      angularConfigPaths,
      schema,
      context,
    ),
] satisfies CreateNodesV2<AngularPluginSchema>;

const createAngularTargets: CreateNodesFunction<
  AngularPluginSchema | undefined
> = (angularConfigPath, schema) => {
  const defaultOptions = {
    /** Build */
    buildTargetName: 'build',
    buildTargetConfiguration: {
      command: 'ng build',
      cache: true,
      inputs: ['default', '^default'],
      outputs: ['{projectRoot}/dist'],
      options: {
        cwd: '{projectRoot}',
      },
    },
    /** Test */
    testTargetName: 'test',
    testTargetConfiguration: {
      command: 'ng test',
      cache: true,
      inputs: ['default', '^default'],
      outputs: ['{projectRoot}/coverage'],
      options: {
        cwd: '{projectRoot}',
      },
    },
    /** Serve */
    serveTargetName: 'serve',
    serveTargetConfiguration: {
      command: 'ng serve',
      options: {
        cwd: '{projectRoot}',
      },
    },
  } satisfies AngularPluginOptions;

  const normalizedOptions = {
    /** Build */
    buildTargetName: schema?.buildTargetName || defaultOptions.buildTargetName,
    buildTargetConfiguration: {
      ...defaultOptions.buildTargetConfiguration,
      ...schema?.buildTargetConfiguration,
      options: {
        ...defaultOptions.buildTargetConfiguration.options,
        ...schema?.buildTargetConfiguration?.options,
      },
    },
    /** Test */
    testTargetName: schema?.testTargetName || defaultOptions.testTargetName,
    testTargetConfiguration: {
      ...defaultOptions.testTargetConfiguration,
      ...schema?.testTargetConfiguration,
      options: {
        ...defaultOptions.testTargetConfiguration.options,
        ...schema?.testTargetConfiguration?.options,
      },
    },
    /** Serve */
    serveTargetName: schema?.serveTargetName || defaultOptions.serveTargetName,
    serveTargetConfiguration: {
      ...defaultOptions.serveTargetConfiguration,
      ...schema?.serveTargetConfiguration,
      options: {
        ...defaultOptions.serveTargetConfiguration.options,
        ...schema?.serveTargetConfiguration?.options,
      },
    },
  } satisfies AngularPluginOptions;

  const angularProjectRoot = dirname(angularConfigPath);

  return {
    projects: {
      [angularProjectRoot]: {
        targets: {
          /** Build */
          [normalizedOptions.buildTargetName]:
            normalizedOptions.buildTargetConfiguration,
          /** Test */
          [normalizedOptions.testTargetName]:
            normalizedOptions.testTargetConfiguration,
          /** Serve */
          [normalizedOptions.serveTargetName]:
            normalizedOptions.serveTargetConfiguration,
        },
      },
    },
  };
};
