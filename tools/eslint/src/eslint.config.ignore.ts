import { type Linter } from 'eslint';

export const ignoreEslintConfig = [
  {
    ignores: [
      'dist/',
      'dist-spec/',
      'out-tsc/',
      'node_modules/',
      'tmp/',
      'coverage/',
      '**/*.timestamp-*',
    ],
  },
] satisfies Linter.Config[];

export default ignoreEslintConfig;
