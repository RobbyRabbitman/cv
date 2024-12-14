import { type Linter } from 'eslint';
import nodeEslint from 'eslint-plugin-n';
import packageJson from '../../../package.json' with { type: 'json' };
import baseEslintConfig from './eslint.config.base.js';

const nodeEslintConfigRecomended =
  nodeEslint.configs['flat/recommended-module'];

const nodeEslintConfig = [
  ...baseEslintConfig,
  /** https://github.com/eslint-community/eslint-plugin-n */
  {
    ...nodeEslintConfigRecomended,
    settings: {
      ...nodeEslintConfigRecomended.settings,
      node: {
        version: packageJson.engines.node,
      },
    },
    files: [
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      '**/*.ts',
      '**/*.mts',
      '**/*.cts',
    ],
    rules: {
      ...nodeEslintConfigRecomended.rules,
      /** @nx/dependency-checks is handling the dependency checks */
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-extraneous-import': 'off',

      'n/no-process-exit': 'off',
    },
  },
] satisfies Linter.Config[];

export default nodeEslintConfig;
