import type { Linter } from 'eslint';
import playwrightEslint from 'eslint-plugin-playwright';
import ignoreEslintConfig from './ignore.js';
import nodeEslintConfig from './node.js';

export const playwrightEslintConfig = [
  ...ignoreEslintConfig,
  ...nodeEslintConfig,

  /** https://github.com/playwright-community/eslint-plugin-playwright */
  {
    ...playwrightEslint.configs['flat/recommended'],
    files: ['**/*.ts'],
  },
] satisfies Linter.Config[];

export default playwrightEslintConfig;
