import { type Linter } from 'eslint';
import tsEslint from 'typescript-eslint';
import ignoreEslintConfig from './ignore.js';

export const tsEslintConfig = [
  ...ignoreEslintConfig,

  /** https://typescript-eslint.io/getting-started */
  ...tsEslint
    .config(...tsEslint.configs.strict, ...tsEslint.configs.stylistic)
    .map(
      (tsEslintConfig) =>
        ({
          ...tsEslintConfig,
          files: ['**/*.ts', '**/*.mts', '**/*.cts', '**/*.tsx'],
        }) as Linter.Config, // TODO: Check why types are incompatible
    ),
  {
    files: ['**/*.spec.ts', '**/*.spec.mts', '**/*.spec.cts', '**/*.spec.tsx'],
    rules: {
      /**
       * Allow non-null assertions in tests e.g. when working with lists or
       * mocks where you _know better_ than the compiler and ! is safe and
       * reduces boilerplate.
       */
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
] satisfies Linter.Config[];

export default tsEslintConfig;
