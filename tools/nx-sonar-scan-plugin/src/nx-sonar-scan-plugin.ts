import {
  type CreateNodesFunction,
  type CreateNodesV2,
  type TargetConfiguration,
  createNodesFromFiles,
  getPackageManagerCommand,
} from '@nx/devkit';
import sonarPackageJson from '@robby-rabbitman/cv-tools-sonar/package.json';
import { dirname } from 'path';

/**
 * The configuration of a sonar scan target.
 *
 * @see {@link SonarScanPluginOptions.sonarScanTargetConfiguration}
 */
export type SonarScanTargetConfiguration = TargetConfiguration;

/** @see {@link createSonarScanTarget} */
export type SonarScanPluginSchema = Partial<SonarScanPluginOptions>;

/** @see {@link createSonarScanTarget} */
export interface SonarScanPluginOptions {
  /** The name of the target to run the sonar scan e.g `sonar-scan` */
  sonarScanTargetName?: string;

  /** The configuration for the sonar scan target. */
  sonarScanTargetConfiguration?: SonarScanTargetConfiguration;
}

/**
 * The glob pattern that represents the projects that have a sonar scan. It is
 * based on the presence of a `sonar-project.properties` file.
 */
export const SONAR_PROJECT_PROPERTIES_GLOB = '**/sonar-project.properties';

/** The command to run the sonar scan. */
export const SONAR_SCAN_COMMAND = `${getPackageManagerCommand().exec} nx run ${sonarPackageJson.name}:${'exec-sonar-scan-cli' satisfies keyof typeof sonarPackageJson.nx.targets}`;

/** https://nx.dev/extending-nx/recipes/project-graph-plugins */
export const createNodesV2 = [
  SONAR_PROJECT_PROPERTIES_GLOB,
  (sonarScanConfigPaths, schema, context) =>
    createNodesFromFiles(
      createSonarScanTarget,
      sonarScanConfigPaths,
      schema,
      context,
    ),
] satisfies CreateNodesV2<SonarScanPluginSchema>;

/**
 * Adds a sonar scan target in the project node where the
 * `sonar-project.properties` file is in.
 *
 * - A custom target name can be provided by setting the `sonarScanTargetName`
 * - The target can be configured by setting the `sonarScanTargetConfiguration`
 */
const createSonarScanTarget: CreateNodesFunction<
  SonarScanPluginSchema | undefined
> = (sonarScanConfigPath, schema) => {
  const defaultOptions = {
    sonarScanTargetName: 'sonar-scan',
    sonarScanTargetConfiguration: {
      command: SONAR_SCAN_COMMAND,
    },
  } satisfies Partial<SonarScanPluginOptions>;

  const options = {
    sonarScanTargetName:
      schema?.sonarScanTargetName || defaultOptions.sonarScanTargetName,
    sonarScanTargetConfiguration: {
      ...defaultOptions.sonarScanTargetConfiguration,
      ...schema?.sonarScanTargetConfiguration,
    },
  } satisfies SonarScanPluginOptions;

  const { sonarScanTargetName, sonarScanTargetConfiguration } = options;

  const sonarScanProjectRoot = dirname(sonarScanConfigPath);

  return {
    projects: {
      /**
       * We add the sonar scan target to the project node where the
       * `sonar-project.properties` file is in.
       *
       * NOTE: this forces the `sonar-project.properties` to be present next to
       * the `project.json` file or _the_ root of a project.
       */
      [sonarScanProjectRoot]: {
        targets: {
          [sonarScanTargetName]: sonarScanTargetConfiguration,
        },
      },
    },
  };
};
