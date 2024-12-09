import { type Linter } from 'eslint';
import nodeEslint from 'eslint-plugin-n';
import packageJson from '../../../package.json' with { type: 'json' };
import ignoreEslintConfig from './eslint.config.ignore.js';
import jsEslintConfig from './eslint.config.javascript.js';
import nxEslintConfig from './eslint.config.nx.js';
import tsEslintConfig from './eslint.config.typescript.js';

const nodeEslintConfigRecomended =
  nodeEslint.configs['flat/recommended-module'];

const nodeEslintConfig = [
  ...ignoreEslintConfig,
  ...jsEslintConfig,
  ...tsEslintConfig,
  ...nxEslintConfig,
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
