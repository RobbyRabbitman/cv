import { type Linter } from 'eslint';
import globals from 'globals';
import ignoreEslintConfig from './ignore.js';
import jsEslintConfig from './javascript.js';
import nxEslintConfig from './nx.js';
import tsEslintConfig from './typescript.js';

export const webEslintConfig = [
  ...ignoreEslintConfig,
  ...jsEslintConfig,
  ...tsEslintConfig,
  ...nxEslintConfig,

  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.mts'],
    languageOptions: {
      globals: globals.browser,
    },
  },
] satisfies Linter.Config[];

export default webEslintConfig;
