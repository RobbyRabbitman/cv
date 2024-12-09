import jsEslint from '@eslint/js';
import { type Linter } from 'eslint';
import prettierEslintConfig from 'eslint-config-prettier';
import chaiFriendlyEslintPlugin from 'eslint-plugin-chai-friendly';
import ignoreEslintConfig from './eslint.config.ignore.js';

const jsEslintConfig = [
  ...ignoreEslintConfig,
  /** https://eslint.org/docs/latest/use/getting-started */
  {
    ...jsEslint.configs.recommended,
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.jsx'],
  },
  /**
   * Make eslint not complain about chai assertions -
   * https://www.npmjs.com/package/eslint-plugin-chai-friendly
   */
  {
    ...chaiFriendlyEslintPlugin.configs.recommendedFlat,
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.jsx'],
  },
  prettierEslintConfig,
] satisfies Linter.Config[];

export default jsEslintConfig;
