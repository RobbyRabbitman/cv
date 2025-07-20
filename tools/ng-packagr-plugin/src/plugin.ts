import {
  type CreateNodesFunction,
  type CreateNodesV2,
  type TargetConfiguration,
  createNodesFromFiles,
} from '@nx/devkit';
import { existsSync } from 'fs';
import { dirname } from 'path';

interface NgPackagrPluginOptions {
  buildTargetName?: string;
  buildTargetConfiguration?: TargetConfiguration;
  testTargetName?: string;
  testTargetConfiguration?: TargetConfiguration;
}

const NG_PACKAGR_CONFIG_FILE_NAME = 'ng-package.json';
const NG_PACKAGR_CONFIG_GLOB = `**/${NG_PACKAGR_CONFIG_FILE_NAME}`;

export const createNodesV2 = [
  NG_PACKAGR_CONFIG_GLOB,
  (ngPackagrConfigPaths, options, context) =>
    createNodesFromFiles(
      createNgPackagrTargets,
      ngPackagrConfigPaths,
      options ?? {},
      context,
    ),
] satisfies CreateNodesV2<NgPackagrPluginOptions>;

const createNgPackagrTargets: CreateNodesFunction<
  NgPackagrPluginOptions | undefined
> = (ngPackagrConfigPath, options) => {
  const {
    buildTargetConfiguration,
    buildTargetName,
    testTargetConfiguration,
    testTargetName,
  } = normalizeNgPackagrPluginOptions(options);

  const maybeProjectRoot = dirname(ngPackagrConfigPath);

  const isProject = existsSync(`${maybeProjectRoot}/package.json`);

  /**
   * Make sure to not create targets for secondary entry points as they can
   * exist in the same npm package e.g. under
   * src/some-entry-point/ng-package.json
   */
  if (!isProject) {
    return {};
  }

  /** This assignment is valid since we return, when its not the project root. */
  const projectRoot = maybeProjectRoot;

  return {
    projects: {
      [projectRoot]: {
        targets: {
          [buildTargetName]: buildTargetConfiguration,
          [testTargetName]: testTargetConfiguration,
        },
      },
    },
  };
};

function normalizeNgPackagrPluginOptions(options?: NgPackagrPluginOptions) {
  const normalizedOptions = {
    /** Build */
    buildTargetName: options?.buildTargetName || 'build',
    buildTargetConfiguration: {
      command: 'ng-packagr',
      cache: true,
      inputs: ['default', '^default'],
      outputs: ['{projectRoot}/dist'],
      ...options?.buildTargetConfiguration,
      options: {
        cwd: '{projectRoot}',
        config: 'tsconfig.lib.json',
        ...options?.buildTargetConfiguration?.options,
      },
    },
    /** Test */
    testTargetName: options?.testTargetName || 'test',
    testTargetConfiguration: {
      executor: '@angular-devkit/build-angular:karma',
      cache: true,
      inputs: ['default', '^default'],
      outputs: ['{projectRoot}/coverage'],
      ...options?.testTargetConfiguration,
      options: {
        tsConfig: '{projectRoot}/tsconfig.spec.json',
        ...options?.testTargetConfiguration?.options,
      },
    },
  } satisfies NgPackagrPluginOptions;

  return normalizedOptions;
}
