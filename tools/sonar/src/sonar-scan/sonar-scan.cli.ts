import { logger, workspaceRoot } from '@nx/devkit';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  defaultSonarProperties as getDefaultSonarProperties,
  SONAR_SCAN_PROJECT_TECHNOLOGIES,
  sonarScan,
  type SonarScanOptions,
  type SonarScanProjectTechnology,
} from './sonar-scan.js';

await sonarScanCli();

export async function sonarScanCli() {
  try {
    const options = await yargs(hideBin(process.argv))
      .strict()
      .option('projectName', {
        type: 'string',
        demandOption: true,
      })
      .option('projectTechnology', {
        type: 'string',
        array: true,
        choices: SONAR_SCAN_PROJECT_TECHNOLOGIES,
        description: 'The technology of the project to scan.',
      })
      .option('inferredProjectTechnology', {
        type: 'string',
        array: true,
        description:
          'The technology of the project to scan based on the presence of specific files e.g. --inferredProjectTechnology js=package.json --inferredProjectTechnology js=tsconfig.json',
      })
      .option('inferredProjectTestTechnologies', {
        type: 'string',
        array: true,
        description:
          'The technology of the project to scan based on the presence of specific files e.g. --inferredProjectTestTechnologies karma=karma.config.js',
      })
      .option('option', {
        type: 'string',
        array: true,
        description:
          'e.g. --option sonar.token=my-token - see https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/analysis-parameters/',
      })
      .parserConfiguration({
        'strip-dashed': true,
      })
      .parseAsync();

    logger.verbose('[sonarScanCli] options', options);

    const defaultSonarProperties = getDefaultSonarProperties();

    logger.verbose(
      '[sonarScanCli] defaultSonarProperties',
      defaultSonarProperties,
    );

    const userSonarProperties = Object.fromEntries(
      (options.option ?? []).map((option) => option.split('=')),
    );

    logger.verbose('[sonarScanCli] userSonarProperties', userSonarProperties);

    const inferredProjectTechnologies = (
      options.inferredProjectTechnology ?? []
    )
      .flatMap((inferredProjectTechnologies) =>
        inferredProjectTechnologies.split(','),
      )
      .map(
        (inferredProjectTechnology) =>
          inferredProjectTechnology.split('=') as [
            SonarScanProjectTechnology,
            string,
          ],
      )
      .reduce(
        (inferredProjectTechnologies, [technology, file]) => ({
          ...inferredProjectTechnologies,
          [technology]: [
            ...(inferredProjectTechnologies[technology] ?? []),
            file,
          ],
        }),
        {} as NonNullable<SonarScanOptions['inferredProjectTechnologies']>,
      );

    const inferredProjectTestTechnologies = (
      options.inferredProjectTestTechnologies ?? []
    )
      .flatMap((inferredProjectTestTechnologies) =>
        inferredProjectTestTechnologies.split(','),
      )
      .map(
        (inferredProjectTestTechnology) =>
          inferredProjectTestTechnology.split('=') as [
            SonarScanProjectTechnology,
            string,
          ],
      )
      .reduce(
        (inferredProjectTestTechnologies, [technology, file]) => ({
          ...inferredProjectTestTechnologies,
          [technology]: [
            ...(inferredProjectTestTechnologies[technology] ?? []),
            file,
          ],
        }),
        {} as NonNullable<SonarScanOptions['inferredProjectTestTechnologies']>,
      );

    const combinedOptions = {
      workspaceRoot,
      projectName: options.projectName,
      projectTechnologies: options.projectTechnology,
      inferredProjectTechnologies,
      properties: {
        ...defaultSonarProperties,
        ...userSonarProperties,
      },
    } satisfies SonarScanOptions;

    logger.verbose('[sonarScanCli] combinedOptions', combinedOptions);

    await sonarScan(combinedOptions);

    process.exit(0);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
