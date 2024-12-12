import {
  type CreateNodesFunction,
  type CreateNodesV2,
  type ProjectConfiguration,
  type TargetConfiguration,
  createNodesFromFiles,
} from '@nx/devkit';
import { dirname } from 'path';

export type NgPackagrPluginSchema = Partial<NgPackagrPluginOptions>;

export interface NgPackagrPluginOptions {
  buildTargetName: string;
  buildTargetConfiguration?: TargetConfiguration;
  testTargetName: string;
  testTargetConfiguration: TargetConfiguration;
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
    buildTargetName: 'build',
    testTargetName: 'test',
    testTargetConfiguration: {
      executor: '@angular-devkit/build-angular:web-test-runner',
      options: {
        include: ['{projectRoot}/src/**/*.spec.ts'],
        tsConfig: '{projectRoot}/tsconfig.spec.json',
        polyfills: ['zone.js', 'zone.js/testing'],
      },
    },
  } satisfies NgPackagrPluginOptions;

  const normalizedOptions = {
    buildTargetName: schema?.buildTargetName || defaultOptions.buildTargetName,
    testTargetName: schema?.testTargetName || defaultOptions.testTargetName,
    testTargetConfiguration: {
      ...defaultOptions.testTargetConfiguration,
      ...schema?.testTargetConfiguration,
      options: {
        ...defaultOptions.testTargetConfiguration.options,
        ...schema?.testTargetConfiguration?.options,
      },
    },
    buildTargetConfiguration: schema?.buildTargetConfiguration,
  } satisfies NgPackagrPluginOptions;

  const ngPackagrProjectRoot = dirname(ngPackagrConfigPath);

  const ngPackagrTargets: NonNullable<ProjectConfiguration['targets']> = {};

  ngPackagrTargets[normalizedOptions.buildTargetName] = {
    command: 'ng-packagr',
    outputs: ['{projectRoot}/dist'],
    ...normalizedOptions.buildTargetConfiguration,
    options: {
      cwd: '{projectRoot}',
      ...normalizedOptions.buildTargetConfiguration?.options,
    },
  };

  ngPackagrTargets[normalizedOptions.testTargetName] =
    normalizedOptions.testTargetConfiguration;

  return {
    projects: {
      [ngPackagrProjectRoot]: {
        targets: ngPackagrTargets,
      },
    },
  };
};
