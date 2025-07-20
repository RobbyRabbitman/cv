import { type Linter } from 'eslint';

export const ignoreEslintConfig = [
  {
    ignores: [
      'dist/',
      'build/',
      'node_modules/',
      'tmp/',
      '.storage/',
      'coverage/',
      '**/*.timestamp-*',
    ],
  },
] satisfies Linter.Config[];

export default ignoreEslintConfig;
