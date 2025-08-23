import angularEslint from 'angular-eslint';
import { type Linter } from 'eslint';
import tsEslint, { type ConfigWithExtends } from 'typescript-eslint';
import ignoreEslintConfig from './ignore.js';
import webEslintConfig from './web.js';

export const angularEslintConfig = [
  ...ignoreEslintConfig,
  ...webEslintConfig,

  /** https://github.com/angular-eslint/angular-eslint */
  ...tsEslint.config(
    {
      files: ['**/*.ts'],
      extends: [
        ...(angularEslint.configs.tsRecommended as ConfigWithExtends[]),
      ],
      processor: angularEslint.processInlineTemplates,
      rules: {
        '@angular-eslint/component-class-suffix': 'off',
        '@angular-eslint/directive-class-suffix': 'off',
        '@typescript-eslint/no-extraneous-class': 'off',
      },
    },
    {
      files: ['**/*.html'],
      extends: [
        ...(angularEslint.configs.templateRecommended as ConfigWithExtends[]),
        ...(angularEslint.configs.templateAccessibility as ConfigWithExtends[]),
      ],
    },
  ),
  {
    files: ['**/src/testing/**/*.ts'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
] as Linter.Config[];

export default angularEslintConfig;
