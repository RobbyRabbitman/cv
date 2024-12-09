import { type Linter } from 'eslint';
import globals from 'globals';
import angularEslintConfig from './eslint.config.angular.js';
import ignoreEslintConfig from './eslint.config.ignore.js';
import jsEslintConfig from './eslint.config.javascript.js';
import nxEslintConfig from './eslint.config.nx.js';
import tsEslintConfig from './eslint.config.typescript.js';

export const webEslintConfig = [
  ...ignoreEslintConfig,
  ...jsEslintConfig,
  ...tsEslintConfig,
  ...nxEslintConfig,
  ...angularEslintConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
] satisfies Linter.Config[];

export default webEslintConfig;
