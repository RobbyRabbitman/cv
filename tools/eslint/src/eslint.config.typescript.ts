import { type Linter } from 'eslint';
import chaiFriendlyEslintPlugin from 'eslint-plugin-chai-friendly';
import tsEslint from 'typescript-eslint';
import ignoreEslintConfig from './eslint.config.ignore.js';

const tsEslintConfig = [
  ...ignoreEslintConfig,
  /** https://typescript-eslint.io/getting-started */
  ...tsEslint
    .config(...tsEslint.configs.strict, ...tsEslint.configs.stylistic)
    .map((tsEslintConfig) => ({
      ...tsEslintConfig,
      files: ['**/*.ts', '**/*.mts', '**/*.cts', '**/*.tsx'],
      rules: {
        ...tsEslintConfig.rules,
        /**
         * Chai friendly covers no-unused-expressions but does not disable the
         *
         * @typescript-eslint version
         * https://github.com/ihordiachenko/eslint-plugin-chai-friendly/issues/41
         */
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-extraneous-class': [
          'error',
          { allowWithDecorator: true },
        ],
      },
    })),
  /**
   * Make eslint not complain about chai assertions -
   * https://www.npmjs.com/package/eslint-plugin-chai-friendly
   */
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts', '**/*.tsx'],
    ...chaiFriendlyEslintPlugin.configs.recommendedFlat,
  },
  {
    files: ['**/*.spec.ts', '**/*.spec.mts', '**/*.spec.cts', '**/*.spec.tsx'],
    rules: {
      /**
       * Allow non-null assertions in tests e.g. when working with lists or
       * mocks where you know better than the compiler and ! is safe and reduces
       * boilerplate.
       */
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
] satisfies Linter.Config[];

export default tsEslintConfig;
