import { logger, readCachedProjectGraph } from '@nx/devkit';
import { getCurrentBranchName } from '@robby-rabbitman/cv-node-util';
import { existsSync } from 'fs';
import { join } from 'path';
import { scan } from 'sonarqube-scanner';

export type SonarProperties = Record<string, string>;

export const SONAR_SCAN_PROJECT_TECHNOLOGIES = ['js'] as const;

/** @see {@link SonarScanOptions} */
export type SonarScanProjectTechnology =
  (typeof SONAR_SCAN_PROJECT_TECHNOLOGIES)[number];

/** @see {@link sonarScan} options. */
export interface SonarScanOptions {
  /** The name of the nx project to scan. */
  projectName: string;

  /**
   * `sonar.*` properties to pass to the sonar scan. They take precedence over
   * inferred and base properties.
   */
  properties?: SonarProperties;

  /**
   * Adds technology specific properties to the sonar scan options.
   *
   * - {@link buildJsBasedSonarProperties js}
   */
  projectTechnologies?: SonarScanProjectTechnology[];

  /**
   * Adds technology specific properties to the sonar scan options based on the
   * presence of specific files.
   *
   * @example
   *   {
   *     "js": [
   *       "{projectRoot}/package.json",
   *       "{projectRoot}/tsconfig.json",
   *       "{projectRoot}/vitest.config.ts"
   *     ],
   *     "java": ["{projectRoot}/build.gradle"]
   *   }
   *
   * @see {@link buildJsBasedSonarProperties.projectTechnology}
   */
  inferredProjectTechnologies?: Partial<
    Record<SonarScanProjectTechnology, string[]>
  >;

  /** The root of the nx workspace. */
  workspaceRoot: string;
}

export function defaultSonarProperties() {
  return {
    'sonar.verbose':
      process.env.NX_VERBOSE_LOGGING === 'true' ? 'true' : 'false',
    'sonar.log.level': 'INFO',
    'sonar.host.url': 'https://sonarcloud.io',
  } satisfies SonarProperties;
}

export async function sonarScan(options: SonarScanOptions) {
  const {
    projectName,
    workspaceRoot,
    inferredProjectTechnologies,
    projectTechnologies,
    properties,
  } = options;

  const project = readCachedProjectGraph().nodes[projectName];

  if (!project) {
    throw new Error(
      `[sonarScan] No project found with the name '${projectName}'.`,
    );
  }

  const projectDirectory = project.data.root;
  const projectRoot = join(workspaceRoot, projectDirectory);

  const sonarBaseProperties = {
    'sonar.scm.provider': 'git',
    'sonar.projectBaseDir': projectRoot,
    'sonar.projectKey': projectName,
    'sonar.sourceEncoding': 'UTF-8',
  } satisfies SonarProperties;

  const normalizedProjectTechnologies = normalizeProjectTechnologies({
    workspaceRoot,
    inferredProjectTechnologies,
    projectTechnologies,
  });

  logger.verbose(
    '[sonarScan] normalizedProjectTechnologies',
    normalizedProjectTechnologies,
  );

  const technologyBasedSonarProperties = buildTechnologyBasedSonarProperties({
    projectTechnologies: normalizedProjectTechnologies,
    projectDirectory,
    workspaceRoot,
  });

  /**
   * Priority order: base properties < technology specific properties < scan
   * properties passed to the function.
   */
  const sonarProperties: SonarProperties = {
    ...sonarBaseProperties,
    ...technologyBasedSonarProperties,
    ...properties,
  };

  /**
   * If the branch name is not provided in the properties set it to the current
   * branch when its not a pull request - sonar will fail because their relation
   * is exclusive.
   */
  const sonarBranchNameProperty = 'sonar.branch.name';
  const sonarPullrequestBranchNameProperty = 'sonar.pullrequest.branch';
  if (
    !sonarProperties[sonarBranchNameProperty] &&
    !sonarProperties[sonarPullrequestBranchNameProperty]
  ) {
    sonarProperties[sonarBranchNameProperty] = getCurrentBranchName();
  }

  logger.verbose(
    '[sonarScan] invoking sonar scan with properties:',
    sonarProperties,
  );

  return scan({
    options: sonarProperties,
  });
}

/**
 * Gets the project technologies based on the explicit project technologies and
 * the inferred project technologies.
 *
 * - If there are no inferred project technologies, the explicit project
 *   technologies are returned.
 * - If there are inferred project technologies, the explicit project technologies
 *   are joined with the inferred project technologies
 *
 * A project technology is inferred if one of the specfied file is present - the
 * paths are relative to the nx workspace root.
 *
 * @example
 *   const inferredProjectTechnologies = {
 *     js: [
 *       '{projectRoot}/package.json',
 *       '{projectRoot}/tsconfig.json',
 *       '{projectRoot}/vitest.config.ts',
 *     ],
 *   };
 */
export function normalizeProjectTechnologies(options: {
  projectTechnologies?: SonarScanProjectTechnology[];
  inferredProjectTechnologies?: Record<string, string[]>;
  workspaceRoot: string;
}) {
  const { projectTechnologies, inferredProjectTechnologies, workspaceRoot } =
    options;

  /**
   * When there are no project technologies to look for, we can just early
   * return the explicit project technologies.
   */
  if (!inferredProjectTechnologies) {
    return projectTechnologies ?? [];
  }

  const normalizedProjectTechnologies = new Set(projectTechnologies);

  for (const [technology, files] of Object.entries(
    inferredProjectTechnologies,
  )) {
    if (files.some((file) => existsSync(join(workspaceRoot, file)))) {
      normalizedProjectTechnologies.add(
        technology as SonarScanProjectTechnology,
      );
    }
  }

  return Array.from(normalizedProjectTechnologies);
}

/**
 * Builds the sonar properties for the sonar scan based on the project
 * technologies. When there are multiple project technologies, the properties
 * are merged.
 */
export function buildTechnologyBasedSonarProperties(options: {
  projectTechnologies: SonarScanProjectTechnology[];
  projectDirectory: string;
  workspaceRoot: string;
}) {
  const { projectTechnologies, projectDirectory, workspaceRoot } = options;

  const technologyBuildersForSonarProperties: Record<
    SonarScanProjectTechnology,
    () => SonarProperties
  > = {
    js: () =>
      buildJsBasedSonarProperties({
        projectDirectory,
        workspaceRoot,
      }),
  };

  const sonarTechnologyProperties = projectTechnologies.reduce(
    (sonarOptions, technology) => ({
      ...sonarOptions,
      ...technologyBuildersForSonarProperties[technology](),
    }),
    {} as SonarProperties,
  );

  return sonarTechnologyProperties;
}

/**
 * Builds the sonar properties for a sonar scan for a js based project.
 *
 * Requires the following files to be present:
 *
 * - `${options.projectDirectory}/src` The directory containing the source **and**
 *   test files to scan
 * - `${options.projectDirectory}/tsconfig.json` The TypeScript configuration file
 *   for the project
 * - `${options.projectDirectory}/coverage/lcov.info` The LCOV coverage report
 *   file of the tests.
 *
 * Optionally the following files can be present:
 *
 * - `${options.projectDirectory}/coverage/execution-report.xml` The execution
 *   report file.
 *
 * Coverage:
 *
 * - Excludes test and storybook files from the coverage file set.
 */
export function buildJsBasedSonarProperties(options: {
  projectDirectory: string;
  workspaceRoot: string;
}) {
  const { projectDirectory, workspaceRoot } = options;

  const sourceDirectory = 'src';

  const coverageDirectory = 'coverage';

  const jsBasedFileExtensions = [
    'js',
    'jsx',
    'mjs',
    'cjs',
    'ts',
    'tsx',
    'mts',
    'cts',
  ];

  const testFilePattern = jsBasedFileExtensions
    .map(
      (jsBasedFileExtension) =>
        `${sourceDirectory}/**/*.spec.${jsBasedFileExtension}`,
    )
    .join(',');

  const storybookStoryFilePattern = jsBasedFileExtensions
    .map(
      (jsBasedFileExtension) =>
        `${sourceDirectory}/**/*.stories.${jsBasedFileExtension}`,
    )
    .join(',');

  /**
   * For the js sonar properties we need to make sure we set the initial scope
   * and define the `source` and `test` file sets, because per convention test
   * files are located in the same directory as the source files:
   *
   * 1. We need to exclude the test files from the source file set
   * 2. We need to include the test files to the test file set so that any non test
   *    file is excluded
   * 3. We need to exclude the test files from the coverage
   *
   * https://docs.sonarsource.com/sonar/latest/project-administration/analysis-scope/#file-exclusion-and-inclusion
   */
  const jsBasedSonarProperties: SonarProperties = {
    /**
     * - Some sonar properties ONLY allow relative paths
     *   https://docs.sonarsource.com/sonar/latest/project-administration/analysis-scope
     * - Only _simple_ wild cards are supported
     *   https://docs.sonarsource.com/sonar/latest/project-administration/analysis-scope/#wildcard-patterns
     */
    'sonar.sources': sourceDirectory,
    'sonar.tests': sourceDirectory,
    'sonar.exclusions': testFilePattern,
    'sonar.test.inclusions': testFilePattern,
    'sonar.typescript.tsconfigPath': 'tsconfig.json',
    'sonar.coverage.exclusions': [
      testFilePattern,
      storybookStoryFilePattern,
    ].join(','),
    'sonar.javascript.lcov.reportPaths': join(coverageDirectory, 'lcov.info'),
  };

  const executionReportPath = join(coverageDirectory, 'execution-report.xml');

  /**
   * Not every js project has a test execution report
   *
   * - Vitest https://www.npmjs.com/package/vitest-sonar-reporter
   */
  if (existsSync(join(workspaceRoot, projectDirectory, executionReportPath))) {
    jsBasedSonarProperties['sonar.testExecutionReportPaths'] =
      executionReportPath;
  }

  return jsBasedSonarProperties;
}
