import angularEslint from 'angular-eslint';
import { type Linter } from 'eslint';
import tsEslint, { type ConfigWithExtends } from 'typescript-eslint';
import ignoreEslintConfig from './eslint.config.ignore.js';

const angularEslintConfig = [
  ...ignoreEslintConfig,
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
] as Linter.Config[];

export default angularEslintConfig;