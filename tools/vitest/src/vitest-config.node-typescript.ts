import { logger } from '@nx/devkit';
import { join } from 'path';
import {
  coverageConfigDefaults,
  defineConfig,
  mergeConfig,
  type UserConfig,
} from 'vitest/config';

export function vitestNodeTypescript(userConfig?: Partial<UserConfig>) {
  const defaultConfig = defineConfig({
    test: {
      globals: true,
      environment: 'node',
      reporters: [
        'default',
        'hanging-process',
        [
          'vitest-sonar-reporter',
          {
            outputFile: join('coverage', 'execution-report.xml'),
          },
        ],
      ],
      coverage: {
        enabled: true,
        clean: true,
        exclude: [...coverageConfigDefaults.exclude, '**/index.ts'],
        thresholds: {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95,
        },
        provider: 'v8',
        reporter: [...coverageConfigDefaults.reporter, 'lcov'],
      },
    },
  });

  const combinedConfig = mergeConfig(
    defaultConfig,
    userConfig ?? {},
  ) as UserConfig;

  logger.verbose('[vitestNodeTypescript] defaultConfig', defaultConfig);
  logger.verbose('[vitestNodeTypescript] userConfig', userConfig);
  logger.verbose('[vitestNodeTypescript] combinedConfig', combinedConfig);

  return combinedConfig;
}
