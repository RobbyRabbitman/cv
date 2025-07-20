import { type Linter } from 'eslint';
import nodeEslint from 'eslint-plugin-n';
import globals from 'globals';
// eslint-disable-next-line @nx/enforce-module-boundaries
import cvPackageJson from '../../../../package.json' with { type: 'json' };
import ignoreEslintConfig from './ignore.js';
import jsEslintConfig from './javascript.js';
import nxEslintConfig from './nx.js';
import tsEslintConfig from './typescript.js';

const nodeEslintRecommendedConfig =
  nodeEslint.configs['flat/recommended-module'];

export const nodeEslintConfig = [
  ...ignoreEslintConfig,
  ...jsEslintConfig,
  ...tsEslintConfig,
  ...nxEslintConfig,

  /** https://github.com/eslint-community/eslint-plugin-n */
  {
    ...nodeEslintRecommendedConfig,
    files: [
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      '**/*.ts',
      '**/*.mts',
      '**/*.cts',
    ],
    languageOptions: {
      globals: globals.node,
    },
    settings: {
      ...nodeEslintRecommendedConfig.settings,
      node: {
        version: cvPackageJson.engines.node,
      },
    },
    rules: {
      ...nodeEslintRecommendedConfig.rules,
      /** @nx/dependency-checks is handling the dependency checks */
      'n/no-missing-import': 'off',
      'n/no-extraneous-import': 'off',

      'n/no-process-exit': 'off',
    },
  },
] satisfies Linter.Config[];

export default nodeEslintConfig;
