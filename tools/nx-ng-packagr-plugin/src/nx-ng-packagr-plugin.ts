import {
  type CreateNodesFunction,
  type CreateNodesV2,
  type TargetConfiguration,
  createNodesFromFiles,
} from '@nx/devkit';
import { dirname } from 'path';

export type NgPackagrPluginSchema = Partial<NgPackagrPluginOptions>;

export interface NgPackagrPluginOptions {
  buildTargetName: string;
  buildTargetConfiguration?: TargetConfiguration;
  testTargetName: string;
  testTargetConfiguration?: TargetConfiguration;
}

const NG_PACKAGR_CONFIG_FILE_NAME = 'ng-package.json';
const NG_PACKAGR_CONFIG_GLOB = `**/${NG_PACKAGR_CONFIG_FILE_NAME}`;

/** https://nx.dev/extending-nx/recipes/project-graph-plugins */
export const createNodesV2 = [
  NG_PACKAGR_CONFIG_GLOB,
  (ngPackagrConfigPaths, schema, context) =>
    createNodesFromFiles(
      createNgPackagrTargets,
      ngPackagrConfigPaths,
      schema,
      context,
    ),
] satisfies CreateNodesV2<NgPackagrPluginSchema>;

const createNgPackagrTargets: CreateNodesFunction<
  NgPackagrPluginSchema | undefined
> = (ngPackagrConfigPath, schema) => {
  const defaultOptions = {
    /** Build */
    buildTargetName: 'build',
    buildTargetConfiguration: {
      command: 'ng-packagr',
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
  } satisfies NgPackagrPluginOptions;

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
  } satisfies NgPackagrPluginOptions;

  const ngPackagrProjectRoot = dirname(ngPackagrConfigPath);

  return {
    projects: {
      [ngPackagrProjectRoot]: {
        targets: {
          /** Build */
          [normalizedOptions.buildTargetName]:
            normalizedOptions.buildTargetConfiguration,
          /** Test */
          [normalizedOptions.testTargetName]:
            normalizedOptions.testTargetConfiguration,
        },
      },
    },
  };
};
