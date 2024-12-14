import { type Linter } from 'eslint';
import globals from 'globals';
import angularEslintConfig from './eslint.config.angular.js';
import baseEslintConfig from './eslint.config.base.js';

export const webEslintConfig = [
  ...baseEslintConfig,
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
