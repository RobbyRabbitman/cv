import { CreateNodes, ProjectConfiguration } from '@nx/devkit';
import { existsSync } from 'fs';
import { basename, dirname, join } from 'path';

export type AngularPluginSchema = Partial<AngularPluginOptions>;

export type AngularPluginOptions = {
  buildTargetName: string;
  testTargetName: string;
};

const ngPackageJsonFileName = 'ng-package.json';
const glob = `**/${ngPackageJsonFileName}`;

export const createNodes: CreateNodes<AngularPluginSchema> = [
  glob,
  (angularConfigPath, schema, context) => {
    const { buildTargetName, testTargetName } = {
      buildTargetName: 'build',
      testTargetName: 'test',
      ...schema,
    } satisfies AngularPluginOptions;

    const maybeProjectRoot = dirname(angularConfigPath);

    const isProject =
      existsSync(
        join(context.workspaceRoot, maybeProjectRoot, 'project.json'),
      ) ||
      existsSync(join(context.workspaceRoot, maybeProjectRoot, 'package.json'));

    if (!isProject) {
      return {};
    }

    const projectRoot = maybeProjectRoot;

    const projectConfig = {
      targets: {},
    } as ProjectConfiguration;

    // add test target
    projectConfig.targets[testTargetName] = {
      executor: '@angular-devkit/build-angular:web-test-runner',
      options: {
        include: ['{projectRoot}/src/**/*.spec.ts'],
        tsConfig: '{projectRoot}/tsconfig.spec.json',
        polyfills: ['zone.js', 'zone.js/testing'],
      },
    };

    // handle ng-package.json
    if (basename(angularConfigPath) === ngPackageJsonFileName) {
      projectConfig.targets[buildTargetName] = {
        executor: '@nx/angular:ng-packagr-lite',
        outputs: ['{workspaceRoot}/dist/{projectRoot}'],
        options: {
          project: '{projectRoot}/ng-package.json',
        },
        configurations: {
          production: {
            tsConfig: '{projectRoot}/tsconfig.lib.prod.json',
          },
          development: {
            tsConfig: '{projectRoot}/tsconfig.lib.json',
          },
        },
        defaultConfiguration: 'production',
      };
    }

    return {
      projects: {
        [projectRoot]: projectConfig,
      },
    };
  },
];
